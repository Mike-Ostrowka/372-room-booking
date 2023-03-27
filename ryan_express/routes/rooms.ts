import { Router } from "express";
import pool from "../index";

// middleware
import isLoggedIn from "./middleware/isLoggedIn";

const roomsRouter = Router();

// helper function to check if user is an admin
const checkUserIsAdmin = async (user_id: number) => {
  const getUserQuery =
    "SELECT * FROM users WHERE user_id = $1 AND isstaff = TRUE";
  const getUserRes = await pool.query(getUserQuery, [user_id]);
  if (getUserRes.rowCount == 0) {
    return false;
  }
  return true;
};

/**
 * Allowing administator to perform the
 * following actions for rooms:
 * -Create
 * -Read
 * -Update
 * -Delete
 */

// POST /rooms - creates a new room
roomsRouter.post("/", isLoggedIn, async (request: any, response: any) => {
  // parse data
  const user_id: number = request.body.user_id;
  const building_name: string = request.body.building_name;
  const room_number: number = request.body.room_number;
  const has_projector: boolean = request.body.has_projector;
  const has_whiteboard: boolean = request.body.has_whiteboard;
  const capacity: number = request.body.capacity;

  try {
    const isUserAdmin = await checkUserIsAdmin(user_id);
    // check if user is an admin
    if (!isUserAdmin) {
      response.status(401).json({
        error: "This user is not an admin",
      });
    } else {
      const addRoomQuery =
        "INSERT INTO rooms (building_name, room_number, hasprojector, haswhiteboard, capacity) VALUES ($1, $2, $3, $4, $5)";
      await pool.query(addRoomQuery, [
        building_name,
        room_number,
        has_projector,
        has_whiteboard,
        capacity,
      ]);
      const getRoomsQuery = "SELECT * FROM rooms";
      const getRoomsRes = await pool.query(getRoomsQuery);
      response.json(getRoomsRes.rows);
    }
  } catch (e) {
    console.log(e);
    response.status(500).json({
      error: e,
    });
  }
});

// GET /rooms - gets all rooms
roomsRouter.get("/:id", isLoggedIn, async (request: any, response: any) => {
  const user_id = request.params.id;
  try {
    const isUserAdmin = await checkUserIsAdmin(user_id);
    // check if user is an admin
    if (!isUserAdmin) {
      response.status(401).json({
        error: "This user is not an admin",
      });
    } else {
      // make query to get rooms
      const getRoomsQuery = "SELECT * FROM rooms";
      const getRoomsRes = await pool.query(getRoomsQuery);
      response.json(getRoomsRes.rows);
    }
  } catch (e) {
    console.log(e);
    response.status(500).json({
      error: e,
    });
  }
});

export default roomsRouter;
