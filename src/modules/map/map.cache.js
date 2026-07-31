class MapCache {

  constructor() {
    this.trucks = new Map();
  }



  normalizeDate(value) {

    const date = new Date(value);


    if (isNaN(date.getTime())) {

      return new Date();

    }


    return date;

  }







  /**
   * Add new truck to cache
   */
  setTruck({
    vehicleId,
    initialPoint,
    previousPoint,
    currentPoint,
    speed,
    recordedAt,
  }) {


    const validDate =
      this.normalizeDate(recordedAt);



    const truck = {

      vehicleId,

      initialPoint,

      previousPoint,

      currentPoint,

      speed,


      status:
        this.calculateStatus(validDate),


      updatedAt:
        validDate,

    };



    this.trucks.set(
      vehicleId,
      truck
    );



    console.log(
      `🚛 Cached truck ${vehicleId}`
    );


    return truck;

  }









  /**
   * Update truck location
   */
  updateTruck({
    vehicleId,
    currentPoint,
    speed,
    recordedAt,
  }) {


    const truck =
      this.trucks.get(vehicleId);



    if (!truck) {

      return null;

    }



    const validDate =
      this.normalizeDate(recordedAt);




    truck.previousPoint =
      truck.currentPoint;



    truck.currentPoint =
      currentPoint;




    truck.speed =
      speed ??
      this.calculateSpeed(

        truck.previousPoint.latitude,

        truck.previousPoint.longitude,

        currentPoint.latitude,

        currentPoint.longitude,

        truck.updatedAt,

        validDate

      );





    truck.updatedAt =
      validDate;




    truck.status =
      this.calculateStatus(validDate);




    this.trucks.set(
      vehicleId,
      truck
    );



    return truck;

  }









  /**
   * Online / Offline calculation
   */
  calculateStatus(recordedAt) {


    const time =
      this.normalizeDate(recordedAt);



    const diffMinutes =
      (
        Date.now()
        -
        time.getTime()
      )
      /
      (1000 * 60);



    return diffMinutes <= 10
      ? "ONLINE"
      : "OFFLINE";

  }









  /**
   * Refresh all truck statuses
   */
  refreshStatuses() {


    for(
      const truck of this.trucks.values()
    ) {


      truck.status =
        this.calculateStatus(
          truck.updatedAt
        );


    }

  }









  /**
   * Remove offline trucks
   * (Call only for admin optimization)
   */
  removeOfflineTrucks() {


    for(
      const [vehicleId, truck]
      of this.trucks.entries()
    ) {


      truck.status =
        this.calculateStatus(
          truck.updatedAt
        );



      if(
        truck.status === "OFFLINE"
      ) {


        this.trucks.delete(
          vehicleId
        );


        console.log(
          `🗑️ Removed offline truck: ${vehicleId}`
        );

      }

    }

  }









  /**
   * Speed calculation
   */
  calculateSpeed(
    lat1,
    lon1,
    lat2,
    lon2,
    previousTime,
    currentTime
  ) {


    const distance =
      this.haversineDistance(
        lat1,
        lon1,
        lat2,
        lon2
      );



    const hours =
      (
        new Date(currentTime)
        -
        new Date(previousTime)
      )
      /
      (1000 * 60 * 60);




    if(hours <= 0){

      return 0;

    }




    return Number(
      (distance / hours)
      .toFixed(2)
    );


  }









  /**
   * Distance calculation
   */
  haversineDistance(
    lat1,
    lon1,
    lat2,
    lon2
  ) {


    const toRadians =
      value =>
        value *
        (Math.PI / 180);



    const R = 6371;



    const dLat =
      toRadians(
        lat2 - lat1
      );



    const dLon =
      toRadians(
        lon2 - lon1
      );



    const a =

      Math.sin(dLat / 2) ** 2

      +

      Math.cos(
        toRadians(lat1)
      )

      *

      Math.cos(
        toRadians(lat2)
      )

      *

      Math.sin(dLon / 2) ** 2;



    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );



    return R * c;

  }









  /**
   * Get single truck
   */
  getTruck(vehicleId) {


    const truck =
      this.trucks.get(vehicleId);



    if(!truck){

      return null;

    }




    truck.status =
      this.calculateStatus(
        truck.updatedAt
      );



    return truck;

  }









  /**
   * Get all trucks
   */
  getAllTrucks() {


    this.refreshStatuses();



    return [
      ...this.trucks.values()
    ];

  }









  clear() {

    this.trucks.clear();

  }

}


export default new MapCache();