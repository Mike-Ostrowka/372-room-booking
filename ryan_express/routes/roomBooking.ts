import { Router } from "express";
import pool from "../index";

// middleware and util functions
import isLoggedIn from './middleware/isLoggedIn';
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
      response.json(bookingsResult.rows);
    } catch (err) {
      console.log(err);
      response.status(500).json({
        error: err,
      });
    }
});
  
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
        response.status(500).json({
        error: `Error: booking duration exceeds the alloted max of ${max_duration} minutes.`,
        });
    }
    if (num_occupants > max_occupants) {
        response.status(500).json({
        error: `Error: number of occupants exceed the alloted max of ${max_occupants}.`,
        });
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

            response.status(500).json({
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
        response.json(bookingResult.rows);
    } catch (err) {
        console.log(err);
        response.status(500).json({
        error: err,
        });
    }
});

export default roomBookingRouter;