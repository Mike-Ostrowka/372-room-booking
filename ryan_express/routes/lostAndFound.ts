import { Router } from "express";
import pool from "../index";

// middleware
import isLoggedInAdmin from "./middleware/isLoggedInAdmin";
import isLoggedIn from "./middleware/isLoggedIn";

const lostAndFoundRouter = Router();

// POST /lost-and-found - creates a new lost item
lostAndFoundRouter.post(
  "/",
  isLoggedIn,
  async (request: any, response: any) => {
    // parse data
    const item_name: string = request.body.item_name;
    const item_description: string = request.body.item_description;
    const user_id: number = request.body.user_id;

    try {
      const addLostItemQuery =
        "INSERT INTO lost_items (item_name, item_description, user_id) VALUES ($1, $2, $3)";
      await pool.query(addLostItemQuery, [
        item_name,
        item_description,
        user_id,
      ]);
      const getLostItemsQuery = "SELECT * FROM lost_items";
      const getLostItemsRes = await pool.query(getLostItemsQuery);
      response.json(getLostItemsRes.rows);
    } catch (e) {
      console.log(e);
      response.status(500).json({
        error: e,
      });
    }
  }
);

// GET /lost-and-found - gets all lost items
lostAndFoundRouter.get(
  "/",
  isLoggedInAdmin,
  async (request: any, response: any) => {
    try {
      // make query to get lost items
      const getLostItemsQuery = "SELECT * FROM lost_items";
      const getLostItemsRes = await pool.query(getLostItemsQuery);
      response.json(getLostItemsRes.rows);
    } catch (e) {
      console.log(e);
      response.status(500).json({
        error: e,
      });
    }
  }
);

// GET /lost-and-found/:id - gets all lost items for a user
lostAndFoundRouter.get(
  "/:id",
  isLoggedIn,
  async (request: any, response: any) => {
    const user_id = request.params.id;

    try {
      // make query to get lost items for user
      const getLostItemsQuery = "SELECT * FROM lost_items WHERE user_id = $1";
      const getLostItemsRes = await pool.query(getLostItemsQuery, [user_id]);
      response.json(getLostItemsRes.rows);
    } catch (e) {
      console.log(e);
      response.status(500).json({
        error: e,
      });
    }
  }
);

// PUT /lost-and-found/:id - updates a lost item
lostAndFoundRouter.put(
  "/:id",
  isLoggedIn,
  async (request: any, response: any) => {
    // parse data
    const lost_item_id: number = request.params.id;
    const item_name: string = request.body.item_name;
    const item_description: string = request.body.item_description;

    try {
      // make query to update room
      const updateLostItemQuery =
        "UPDATE lost_items SET item_name=$1, item_description=$2 WHERE id=$3";
      await pool.query(updateLostItemQuery, [
        item_name,
        item_description,
        lost_item_id,
      ]);
      const getLostItemsQuery = "SELECT * FROM lost_items";
      const getLostItemsRes = await pool.query(getLostItemsQuery);
      response.json(getLostItemsRes.rows);
    } catch (e) {
      console.log(e);
      response.status(500).json({
        error: e,
      });
    }
  }
);

// PUT /lost-and-found/status/:id - updates status of a lost item
lostAndFoundRouter.put(
  "/status/:id",
  isLoggedInAdmin,
  async (request: any, response: any) => {
    // parse data
    const lost_item_id: number = request.params.id;
    const item_found: boolean = request.body.item_found;

    try {
      // make query to update room
      const updateLostItemQuery =
        "UPDATE lost_items SET item_found=$1 WHERE id=$2";
      await pool.query(updateLostItemQuery, [item_found, lost_item_id]);
      const getLostItemsQuery = "SELECT * FROM lost_items";
      const getLostItemsRes = await pool.query(getLostItemsQuery);
      response.json(getLostItemsRes.rows);
    } catch (e) {
      console.log(e);
      response.status(500).json({
        error: e,
      });
    }
  }
);

// DELETE /rooms/:id - deletes a room
lostAndFoundRouter.delete(
  "/:id",
  isLoggedIn,
  async (request: any, response: any) => {
    // parse data
    const lost_item_id = request.params.id;

    try {
      // make query to delete lost item
      const deleteLostItemQuery = "DELETE FROM lost_items WHERE id=$1";
      await pool.query(deleteLostItemQuery, [lost_item_id]);
      const getLostItemsQuery = "SELECT * FROM lost_items";
      const getLostItemsRes = await pool.query(getLostItemsQuery);
      response.json(getLostItemsRes.rows);
    } catch (e) {
      console.log(e);
      response.status(500).json({
        error: e,
      });
    }
  }
);

export default lostAndFoundRouter;
