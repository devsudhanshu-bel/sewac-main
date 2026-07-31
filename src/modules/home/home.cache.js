import redisService from "../redis/redis.service.js";
import redisKeys from "../redis/redis.keys.js";


class HomeCache {


  // =====================================
  // MONTHLY CALENDAR CACHE
  // =====================================


  async getCalendar(
    citizenId,
    year,
    month
  ) {


    const key =
      redisKeys.citizenHomeCalendar(
        citizenId,
        year,
        month
      );


    return await redisService.get(
      key
    );


  }







  async setCalendar(
    citizenId,
    year,
    month,
    data
  ) {


    const key =
      redisKeys.citizenHomeCalendar(
        citizenId,
        year,
        month
      );



    await redisService.set(

      key,

      data,

      300

    );


  }









  // =====================================
  // TODAY COLLECTION CACHE
  // =====================================


  async getToday(
    citizenId
  ) {


    const key =
      redisKeys.citizenToday(
        citizenId
      );



    return await redisService.get(
      key
    );


  }








  async setToday(
    citizenId,
    data
  ) {


    const key =
      redisKeys.citizenToday(
        citizenId
      );



    await redisService.set(

      key,

      data,

      300

    );


  }










  // =====================================
  // CLEAR CITIZEN HOME CACHE
  // =====================================


  async clearCitizenHome(
    citizenId
  ) {



    await redisService.delete(

      redisKeys.citizenHome(
        citizenId
      )

    );



    await redisService.delete(

      redisKeys.citizenToday(
        citizenId
      )

    );


  }




}


export default new HomeCache();