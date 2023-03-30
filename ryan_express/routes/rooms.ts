import { Router } from "express";
import pool from "../index";

// middleware
import isLoggedInAdmin from "./middleware/isLoggedInAdmin";

const roomsRouter = Router();

/**
 * Allowing administator to perform the
 * following actions for rooms:
 * -Create
 * -Read
 * -Update
 * -Delete
 */

// POST /rooms - creates a new room
roomsRouter.post("/", isLoggedInAdmin, async (request: any, response: any) => {
  // parse data
  const building_name: string = request.body.building_name;
  const room_number: number = request.body.room_number;
  const has_projector: boolean = request.body.has_projector;
  const has_whiteboard: boolean = request.body.has_whiteboard;
  const capacity: number = request.body.capacity;

  try {
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
  } catch (e) {
    console.log(e);
    response.status(500).json({
      error: e,
    });
  }
});

// GET /rooms - gets all rooms
roomsRouter.get("/", isLoggedInAdmin, async (request: any, response: any) => {
  try {
    // make query to get rooms
    const getRoomsQuery = "SELECT * FROM rooms";
    const getRoomsRes = await pool.query(getRoomsQuery);
    response.json(getRoomsRes.rows);
  } catch (e) {
    console.log(e);
    response.status(500).json({
      error: e,
    });
  }
});

// PUT /rooms/:id - updates a room
roomsRouter.put(
  "/:room_number/:building_name",
  isLoggedInAdmin,
  async (request: any, response: any) => {
    // parse data
    const room_number: number = request.params.room_number;
    const building_name: string = request.params.building_name;

    const new_room_number: number = request.body.room_number;
    const new_building_name: string = request.body.building_name;
    const has_projector: boolean = request.body.has_projector;
    const has_whiteboard: boolean = request.body.has_whiteboard;
    const capacity: number = request.body.capacity;

    try {
      // make query to update room
      const updateRoomQuery =
        "UPDATE rooms SET building_name=$1, room_number=$2, hasprojector=$3, haswhiteboard=$4, capacity=$5 WHERE room_number=$6 AND building_name=$7";
      await pool.query(updateRoomQuery, [
        new_building_name,
        new_room_number,
        has_projector,
        has_whiteboard,
        capacity,
        room_number,
        building_name,
      ]);
      const getRoomsQuery = "SELECT * FROM rooms";
      const getRoomsRes = await pool.query(getRoomsQuery);
      response.json(getRoomsRes.rows);
    } catch (e) {
      console.log(e);
      response.status(500).json({
        error: e,
      });
    }
  }
);

// DELETE /rooms/:id - deletes a room
roomsRouter.delete(
  "/:room_number/:building_name",
  isLoggedInAdmin,
  async (request: any, response: any) => {
    // parse data
    const room_number = request.params.room_number;
    const building_name = request.params.building_name;

    try {
      // make query to delete room
      const deleteRoomQuery =
        "DELETE FROM rooms WHERE room_number=$1 AND building_name=$2";
      await pool.query(deleteRoomQuery, [room_number, building_name]);
      const getRoomsQuery = "SELECT * FROM rooms";
      const getRoomsRes = await pool.query(getRoomsQuery);
      response.json(getRoomsRes.rows);
    } catch (e) {
      console.log(e);
      response.status(500).json({
        error: e,
      });
    }
  }
);

export default roomsRouter;
