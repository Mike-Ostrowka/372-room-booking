import { Router } from "express";
import pool from "../index";

// middleware and util functions
import isLoggedIn from "./middleware/isLoggedIn";
import timeUtils from "./utils/calcTime";

const roomBookingRouter = Router();

/**
 * Get all room bookings
 */
roomBookingRouter.get("/", isLoggedIn, async (request: any, response: any) => {
  // build and send query
  try {
    var getBookingsQuery = `SELECT * FROM room_bookings;`;
    const bookingsResult = await pool.query(getBookingsQuery);
    console.log(bookingsResult.rows);
    response.status(200).json(bookingsResult.rows);
  } catch (err) {
    console.log(err);
    response.status(500).json({
      error: err,
    });
  }
});

/**
 * Get all room bookings for a given user
 * Endpt: /room-booking/<user_id>
 * Sample request body:
 * {
 *  user_id: 27
 * }
 */
roomBookingRouter.get(
  "/:user_id",
  isLoggedIn,
  async (request: any, response: any) => {
    let user_id: number = request.params.user_id;
    // build and send query
    try {
      var getBookingsQuery = `SELECT * FROM room_bookings WHERE user_id=$1;`;
      const bookingsResult = await pool.query(getBookingsQuery, [user_id]);
      console.log(bookingsResult.rows);
      response.status(200).json(bookingsResult.rows);
    } catch (err) {
      console.log(err);
      response.status(500).json({
        error: err,
      });
    }
  }
);

/**
 * Add a new room booking
 * Building name, room number must exist in the db
 * Sample request body format:
 * {
 *  start_datetime: 'YYYY-MM-DD HH:MM'
 *  duration: 120
 *  num_occupants: 2
 *  building_name: 'SUB'
 *  room_number: 2120
 *  user_id: 1
 * }
 * Constraints:
 * - Max booking duration: 3 hours
 * - Max occupancy: 25
 * - Room must exist
 * - Bookings may only be made for a future time
 */
roomBookingRouter.post("/", isLoggedIn, async (request: any, response: any) => {
  // parse form data
  let start_datetime: string = request.body.start_datetime;
  let duration: number = request.body.duration;
  let num_occupants: number = request.body.num_occupants;
  let building_name: string = request.body.building_name;
  let room_number: number = request.body.room_number;
  let user_id: number = request.body.user_id;

  // check max duration and occupants
  let max_duration: number = 60 * 3;
  let max_occupants: number = 25;
  if (duration > max_duration) {
    console.log("ERROR IN DURATION!!!");
    response.status(400).json({
      error: `Error: booking duration exceeds the alloted max of ${max_duration} minutes.`,
    });
    return;
  }
  if (num_occupants > max_occupants) {
    response.status(400).json({
      error: `Error: number of occupants exceed the alloted max of ${max_occupants}.`,
    });
    return;
  }

  // check that the booking is for a future timeslot
  if (!timeUtils.isFutureDate(start_datetime)) {
    console.log("Error: Bookings may only be made for future timeslots.");
    response.status(400).json({
      error: "Error: Bookings may only be made for future timeslots.",
    });
    return;
  }

  // make sure building and room exists in the rooms table
  try {
    var getRoomQuery = `SELECT * FROM rooms WHERE building_name=$1 AND room_number=$2`;
    const roomResult = await pool.query(getRoomQuery, [
      building_name,
      room_number,
    ]);

    if (roomResult.rowCount === 0) {
      console.log(
        "Error: this room does not exist in the database. please enter a valid building name and room number."
      );

      response.status(400).json({
        error:
          "Error: this room does not exist in the database. please enter a valid building name and room number.",
      });
      return;
    }
  } catch (err) {
    console.log(err);
    response.status(500).json({
      error: err,
    });
  }

  // calculate endtime
  let end_datetime = timeUtils.calculateEndTime(start_datetime, duration);

  // build and send query
  try {
    var addBookingQuery = `INSERT INTO room_bookings (start_datetime, end_datetime, duration, num_occupants, building_name, room_number, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7);`;
    const bookingResult = await pool.query(addBookingQuery, [
      start_datetime,
      end_datetime,
      duration,
      num_occupants,
      building_name,
      room_number,
      user_id,
    ]);
    console.log(bookingResult.rows);
    response.status(200).json(bookingResult.rows);
  } catch (err) {
    console.log(err);
    response.status(500).json({
      error: err,
    });
  }
});

/**
 * Cancel a room booking
 * Sample request body format:
 * {
 *  booking_id: 88,
 *  user_id: 27
 * }
 * Constraints:
 * - Booking must exist and must belong to the user
 * - Must be a future booking
 */
roomBookingRouter.delete(
  "/",
  isLoggedIn,
  async (request: any, response: any) => {
    let booking_id: number = request.body.booking_id;
    let user_id: number = request.body.user_id;

    // check that booking exists and it belongs to the user
    // if booking exists, get the start time
    try {
      var getBookingQuery = `SELECT start_datetime FROM room_bookings WHERE booking_id=$1 AND user_id=$2;`;
      const getBookingResult = await pool.query(getBookingQuery, [
        booking_id,
        user_id,
      ]);

      if (getBookingResult.rowCount === 0) {
        console.log(
          "Error: Either this room booking does not exist, or it does not belong to this user."
        );
        response.status(400).json({
          error:
            "Error: Either this room booking does not exist, or it does not belong to this user..",
        });

        return;
      } else {
        // check that the booking is in the future
        let booking_start = getBookingResult.rows[0].start_datetime;

        if (!timeUtils.isFutureDate(booking_start)) {
          console.log("Error: Only future bookings may be cancelled.");
          response.status(400).json({
            error: "Error: Only future bookings may be cancelled.",
          });
          return;
        }
      }
    } catch (err) {
      console.log(err);
      response.status(500).json({
        error: err,
      });
    }

    // build and send query
    try {
      var deleteBookingQuery = `DELETE FROM room_bookings WHERE booking_id=$1;`;
      const deleteResult = await pool.query(deleteBookingQuery, [booking_id]);
      console.log(deleteResult.rows);
      response.status(200).json(deleteResult.rows);
    } catch (err) {
      console.log(err);
      response.status(500).json({
        error: err,
      });
    }
  }
);

export default roomBookingRouter;
