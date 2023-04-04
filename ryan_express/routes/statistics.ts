import { Router } from "express";
import pool from "../index";
import isLoggedIn from "./middleware/isLoggedIn";

const statisticsRouter = Router();

// GET /statistics - gets statistics for rooms
statisticsRouter.get("/", isLoggedIn, async (request: any, response: any) => {
  if (request.session.user == null) {
    response.send({ statistics: false });
  }
  console.log(request.session.user.u_id);
  const review_count_query: string =
    "SELECT COUNT(*) FROM room_reviews INNER JOIN (SELECT booking_id, user_id from room_bookings) bookings ON room_reviews.booking_id = bookings.booking_id and bookings.user_id = $1;";
  const current_room_bookings_query: string =
    "SELECT COUNT(DISTINCT (room_number, building_name)) from room_bookings where start_datetime < $1 and $1 < end_datetime;";
  const total_rooms_query: string = "SELECT COUNT(*) FROM rooms";
  try {
    let today = new Date();
    let week_in_the_future = new Date();
    week_in_the_future.setDate(week_in_the_future.getDate() + 7);

    //get review counts
    let result = await pool.query(review_count_query, [
      request.session.user.u_id,
    ]);
    let review_count: number = Number(result.rows[0]["count"]);

    //get total available rooms
    result = await pool.query(current_room_bookings_query, [today]);
    let current_room_bookings: number = Number(result.rows[0]["count"]);
    result = await pool.query(total_rooms_query);
    let total_rooms: number = Number(result.rows[0]["count"]);
    let available_rooms: Number = total_rooms - current_room_bookings;

    response.json({ reviews: review_count, available: available_rooms });
  } catch (e) {
    response.send(e);
  }
});

export default statisticsRouter;
