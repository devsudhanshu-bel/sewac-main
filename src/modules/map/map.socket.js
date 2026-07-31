import { Server } from "socket.io";


let io = null;



export const initializeMapSocket = (httpServer) => {


  io = new Server(
    httpServer,
    {
      cors:{
        origin:"*",
        methods:[
          "GET",
          "POST"
        ]
      }
    }
  );



  io.on(
    "connection",
    (socket)=>{


      console.log(
        `🟢 Citizen Connected: ${socket.id}`
      );





      socket.on(
        "joinTruck",
        (vehicleId)=>{


          if(!vehicleId){

            return;

          }



          const room =
            `truck:${vehicleId}`;



          socket.join(
            room
          );



          console.log(
            `🚛 ${socket.id} joined ${room}`
          );


        }
      );







      socket.on(
        "leaveTruck",
        (vehicleId)=>{


          if(!vehicleId){

            return;

          }



          const room =
            `truck:${vehicleId}`;



          socket.leave(
            room
          );



          console.log(
            `🚪 ${socket.id} left ${room}`
          );


        }
      );







      socket.on(
        "disconnect",
        ()=>{


          console.log(
            `🔴 Citizen Disconnected: ${socket.id}`
          );


        }
      );


    }
  );



  return io;


};








export const getMapSocket = ()=>{


  if(!io){

    throw new Error(
      "Socket.IO has not been initialized."
    );

  }



  return io;


};









/**
 * Send truck location update
 * Only citizens watching this truck receive it
 */
export const emitTruckLocationUpdated = (truck)=>{


  if(
    !io ||
    !truck
  ){

    return;

  }



  const room =
    `truck:${truck.vehicleId}`;



  io.to(room).emit(

    "truckLocationUpdated",

    truck

  );


};