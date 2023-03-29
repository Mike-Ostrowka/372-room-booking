import { Router } from "express";
import pool from "../index";

// middleware and util functions
import isLoggedIn from './middleware/isLoggedIn';
import timeUtils from "./utils/calcTime";

const searchRoomsRouter = Router();

/**
 * Search for rooms
 * Returns all available rooms that fit the provided search criteria
 * Sample request body format:
 * {
 *  start_datetime: 'YYYY-MM-DD HH:MM',
 *  duration: 120,
 *  num_occupants: 2,
 *  hasprojector: true,
 *  haswhiteboard: false
 * }
 */
searchRoomsRouter.post("/", isLoggedIn, async (request: any, response: any) => {
    // parse form data
    let start_datetime: string = request.body.start_datetime;
    let duration: number = request.body.duration;
    let num_occupants: number = request.body.num_occupants;
    let hasprojector: boolean = request.body.hasprojector;
    let haswhiteboard: boolean = request.body.haswhiteboard;
  
    // part 1: filter rooms that fit the physical attributes (capacity, equipment)
    let getRoomsQuery = `SELECT * FROM rooms WHERE capacity >= $1 `;
    // only add projector/whiteboard if requested by the user
    // e.g. if we want a projector, but didn't request a whiteboard, still include rooms that have a whiteboard,
    // so we can broaden our search and return more rooms
    if (hasprojector) {
      getRoomsQuery += ` AND hasprojector=true`;
    }
    if (haswhiteboard) {
      getRoomsQuery += ` AND haswhiteboard=true`;
    }
  
    // part 2: get bookings that overlap the requested timeslot
    // determine end time
    let end_datetime = timeUtils.calculateEndTime(start_datetime, duration);
  
    // a booking overlaps if it starts at/after the start time
    // or ends at/after the end time
    let getBookingsQuery = `SELECT building_name, room_number FROM room_bookings WHERE (start_datetime >= $2 AND start_datetime < $3) OR (end_datetime > $4 AND end_datetime <= $5)`;
  
    // part 3: build and send query
    let searchQuery = `SELECT * FROM (${getRoomsQuery}) AS r 
          WHERE NOT EXISTS (
              SELECT * FROM (${getBookingsQuery}) as b 
              WHERE b.building_name=r.building_name AND b.room_number=r.room_number
          );`;
    try {
      const searchResult = await pool.query(searchQuery, [
        num_occupants,
        start_datetime,
        end_datetime,
        start_datetime,
        end_datetime,
      ]);
      console.log(searchResult.rows);
      response.status(200).json(searchResult.rows);
    } catch (err) {
      console.log(err);
      response.status(500).json({
        error: err,
      });
    }
});

export default searchRoomsRouter;