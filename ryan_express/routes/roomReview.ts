import { time } from "console";
import { Router } from "express";
import pool from "../index";

// middleware and util functions
import isLoggedIn from './middleware/isLoggedIn';
import timeUtils from './utils/calcTime';
const roomReviewRouter = Router();

/**
 * Get all room reviews
 */
roomReviewRouter.get("/", isLoggedIn, async (request: any, response: any) => {
    // build and send query
    try {
      var getReviewsQuery = `SELECT * FROM room_reviews;`;
      const reviewsResult = await pool.query(getReviewsQuery);
      console.log(reviewsResult.rows);
      response.status(200).json(reviewsResult.rows);
    } catch (err) {
      console.log(err);
      response.status(500).json({
        error: err,
      });
    }
});

/**
 * Get all reviews for a particular room
 * Endpt: /room-review/room
 * Sample request body:
 * {
 *  building_name: "SUB",
 *  room_number: 4001
 * }
 */
roomReviewRouter.get("/room", isLoggedIn, async (request: any, response: any) => {
    let building_name = request.body.building_name;
    let room_number = request.body.room_number;

    // check that room exists
    try {
        var getRoomQuery = `SELECT * FROM rooms WHERE building_name=$1 AND room_number=$2`;
        const roomResult = await pool.query(getRoomQuery, [building_name,room_number]);

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

    // build and send query
    try {
      var getReviewsQuery = `SELECT room_reviews.* FROM room_reviews 
        INNER JOIN room_bookings ON room_reviews.booking_id=room_bookings.booking_id 
        WHERE building_name=$1 
        AND room_number=$2;`;
      const reviewsResult = await pool.query(getReviewsQuery, [building_name, room_number]);
      console.log(reviewsResult.rows);
      response.json(reviewsResult.rows);
    } catch (err) {
      console.log(err);
      response.status(500).json({
        error: err,
      });
    }
});
  
/**
 * Add a new room review
 * Sample request body format:
 * {
 *  review: 'was a nice room.',
 *  room_rating: 5,
 *  noise_level: 'quiet',
 *  functioning_room: false,
 *  issue_details: 'outlets were not working',
 *  booking_id: 88
 * }
 * Constraints:
 * - Reviews can only be made for past bookings
 * - 1 review per booking
 * - Booking must exist
 */
roomReviewRouter.post("/", isLoggedIn, async (request: any, response: any) => {
    // parse form data
    let review: string = request.body.review;
    let room_rating: number = request.body.room_rating;
    let noise_level: string = request.body.noise_level;
    let functioning_room: boolean = request.body.functioning_room;
    let issue_details:string = request.body.issue_details;
    let booking_id: number = request.body.booking_id;

    // we can have max 1 review per room booking
    // booking id must be unique
    try {
        var getReviewsQuery = `SELECT * FROM room_reviews WHERE booking_id=$1;`;
        const getReviewsResult = await pool.query(getReviewsQuery, [booking_id]);

        if (getReviewsResult.rowCount > 0) {
            console.log("Error: A room review already exists for this booking.");

            response.status(400).json({
                error: "Error: A room review already exists for this booking."
            });

            return;
        }
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: err,
        });
    }

    // check that booking exists and it's a past booking
    try {
        var getBookingsQuery = `SELECT * FROM room_bookings WHERE booking_id=$1;`;
        const getBookingsResult = await pool.query(getBookingsQuery, [booking_id]);

        if (getBookingsResult.rowCount === 0) {
            console.log("Error: This room booking does not exist in the database.");

            response.status(400).json({
                error: "Error: This room booking does not exist in the database."
            });

            return;
        } else {
            let endTime = getBookingsResult.rows[0].end_datetime;

            if (!timeUtils.isPastDate(endTime)) {
                console.log("Error: Reviews may only be made for past bookings");

                response.status(400).json({
                    error: "Error: Reviews may only be made for past bookings"
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
        var addReviewQuery = `INSERT INTO room_reviews (review, room_rating, noise_level, functioning_room, issue_details, booking_id) VALUES ($1, $2, $3, $4, $5, $6);`;
        const reviewsResult = await pool.query(addReviewQuery, [
            review,
            room_rating,
            noise_level,
            functioning_room,
            issue_details,
            booking_id,
        ]);
        console.log(reviewsResult.rows);
        response.json(reviewsResult.rows);
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: err,
        });
    }
});

export default roomReviewRouter;