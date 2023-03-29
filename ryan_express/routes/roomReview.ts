import { Router } from "express";
import pool from "../index";

// middleware and util functions
import isLoggedIn from './middleware/isLoggedIn';
import calculateEndTime from "./utils/calcTime";

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
 * - Booking must exist for the current user
 */
roomReviewRouter.post("/", isLoggedIn, async (request: any, response: any) => {
    // parse form data
    let review: string = request.body.review;
    let room_rating: number = request.body.room_rating;
    let noise_level: string = request.body.noise_level;
    let functioning_room: boolean = request.body.functioning_room;
    let issue_details:string = request.body.issue_details;
    let booking_id: number = request.body.booking_id;

    // TODO: error checking

    // build and send query
    try {
        var addReviewQuery = `INSERT INTO room_reviews (review, room_rating, noise_level, functioning_room, issue_details, booking_id) VALUES ($1, $2, $3, $4, $5, $6);`;
        const bookingResult = await pool.query(addReviewQuery, [
            review,
            room_rating,
            noise_level,
            functioning_room,
            issue_details,
            booking_id,
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

export default roomReviewRouter;