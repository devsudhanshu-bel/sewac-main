const express =
  require("express");


const {
  getComplaintLocations,
} =
  require(
    "../controller/complaintsGrev.controller"
  );


const router =
  express.Router();


/* =========================================================
   GET ALL COMPLAINT LOCATIONS
========================================================= */

/*

GET:

/api/complaints-grev/locations


RETURNS:

{
  success: true,

  count: 6,

  boundary: {
    type: "Polygon",
    coordinates: [...]
  },

  data: [
    {
      lat: 12.9715987,
      long: 77.5945627,

      data: {
        id: 7,
        ticket_number: "...",
        phone_number: "...",
        title: "...",
        description: "...",
        category: "...",
        image_url: "...",
        address: "...",
        status: "CLOSED"
      }
    }
  ]
}

*/

router.get(
  "/locations",
  getComplaintLocations
);


/* =========================================================
   EXPORT
========================================================= */

module.exports =
  router;