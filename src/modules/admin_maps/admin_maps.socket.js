import { Server } from "socket.io";


let io = null;



/**
 * Initialize Admin Map Socket
 */
export const initializeAdminMapsSocket = (httpServer) => {


  io = new Server(httpServer, {

    cors: {

      origin: "*",

      methods: [
        "GET",
        "POST"
      ]

    }

  });




  io.on(
    "connection",
    (socket)=>{


      console.log(
        `🟢 Admin Map Connected: ${socket.id}`
      );



      /**
       * Join admin map room
       */
      socket.on(
        "joinAdminMap",
        ()=>{


          socket.join(
            "admin-live-map"
          );


          console.log(
            `🗺️ ${socket.id} joined admin live map`
          );


        }
      );





      /**
       * Leave admin map room
       */
      socket.on(
        "leaveAdminMap",
        ()=>{


          socket.leave(
            "admin-live-map"
          );


          console.log(
            `🚪 ${socket.id} left admin live map`
          );


        }
      );





      socket.on(
        "disconnect",
        ()=>{


          console.log(
            `🔴 Admin Map Disconnected: ${socket.id}`
          );


        }
      );



    }
  );



  return io;


};






export const getAdminMapSocket = ()=>{


  if(!io){

    throw new Error(
      "Admin Map Socket not initialized."
    );

  }


  return io;


};








/**
 * Broadcast truck movement
 *
 * Event:
 * adminTruckLocationUpdated
 */
export const emitAdminTruckLocationUpdated = (
  truck
)=>{


  if(
    !io ||
    !truck
  ){

    return;

  }



  io
    .to("admin-live-map")
    .emit(

      "adminTruckLocationUpdated",

      truck

    );


};