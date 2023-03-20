// const express = require("express");
import express from 'express';
// const md5 = require("md5");
import md5 from 'md5';
import session from 'express-session'
// const session = require("express-session");
// import cors from 'cors';
const cors = require("cors");
import pg from 'pg';
// const { Pool } = require("pg");

let app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let port = process.env.PORT || 8080;

let pool = new pg.Pool({
  host: "34.82.200.170",
  user: "testuser",
  password: "password",
  database: "room_booking_app",
});

app.use(
  session({
    name: "session",
    secret: "testsecretpleasechange",
    resave: false,
    maxAge: 30 * 60 * 1000,
    saveUninitialized: true,
  })
);

// Middleware to check if the user is logged in
function isLoggedIn(request: any, response: any, next: any) {
  if (request.session.user) {
    console.log("isLoggedIn");
    return next();
  } else {
    console.log("Not logged in.");
    response.json({ success: false });
  }
}

//check if user exists
async function isUser(username: string) {
  try {
    let authenticationQuery = `SELECT json_agg(a) FROM users a WHERE username = $1`;
    const result = await pool.query(authenticationQuery, [username]);
    if (result.rows.length > 0 && result.rows[0].json_agg != null) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
  }
}

// Calculate and format the endtime, 
// given a booking start time and duration
function calculateEndTime(start_time: string, duration: number) {
    let start = new Date(start_time);
    let end = new Date(start.getTime() + duration * 60000);

    // format end time to psql ISO date format
    let end_formatted = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate() + ' ' + end.getHours() + ':' + end.getMinutes();
    return end_formatted;
}

app.use("/", function (req: any, res: any, next: any) {
  console.log(req.method, "request: ", req.url, JSON.stringify(req.body));
  next();
});

app.post("/register-api", async (request: any, response: any) => {
  let firstName: string = request.body.firstName;
  let lastName: string = request.body.lastName;
  let username: string = request.body.username;
  let password: string = md5(request.body.password);
  let isStaff: string = request.body.isStaff || "0";

  if (await isUser(username)) {
    console.log("user already exists");
    response.json({ success: false });
    return;
  }
  try {
    let registerQuery = `INSERT INTO users (username, password, firstname, lastname, isstaff) VALUES ($1, $2, $3, $4, $5)`;
    console.log(registerQuery);
    const result = await pool.query(registerQuery, [
      username,
      password,
      firstName,
      lastName,
      isStaff,
    ]);
    if ((result.rowCount = 1)) {
      console.log("registered user");
      response.json({ success: true });
    } else {
      console.log("failed to register user");
      response.json({ success: false });
    }
  } catch (e) {
    console.log(e);
    response.end(e);
  }
});

app.post("/login-api", async (request: any, response: any) => {
  let hashedpw: string = md5(request.body.password);
  let username: string = request.body.username;
  try {
    let authenticationQuery = `SELECT json_agg(a) FROM users a WHERE username = $1 AND password = $2`;
    const result = await pool.query(authenticationQuery, [username, hashedpw]);
    if (result.rows.length > 0 && result.rows[0].json_agg != null) {
      let userObject = result.rows[0].json_agg[0];
      let properObject = {
        u_id: userObject["user_id"],
        u: userObject["username"],
        p: userObject["password"],
        success: true,
      };
      request.session.regenerate((err: any) => {
        if (err) {
          console.log(err);
          response.status(500).send("Error regenerating session");
        } else {
          request.session.user = properObject;
          response.json(properObject);
        }
      });
    } else {
      console.log("Failed to login!");
      response.json({ success: false });
    }
  } catch (e) {
    console.log(e);
    response.end(e);
  }
});


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
app.post("/search-rooms", isLoggedIn, async (request: any, response: any) => {
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
    let end_datetime = calculateEndTime(start_datetime, duration);

    // a booking overlaps if it starts at/after the start time
    // or ends at/after the end time
    let getBookingsQuery = `SELECT building_name, room_number FROM room_bookings WHERE (start_datetime >= $2 AND start_datetime < $3) OR (end_datetime > $4 AND end_datetime <= $5)`

    // part 3: build and send query
    let searchQuery = `SELECT * FROM (${getRoomsQuery}) AS r 
        WHERE NOT EXISTS (
            SELECT * FROM (${getBookingsQuery}) as b 
            WHERE b.building_name=r.building_name AND b.room_number=r.room_number
        );`
    try {
        const searchResult = await pool.query(searchQuery, [
            num_occupants,
            start_datetime,
            end_datetime,
            start_datetime,
            end_datetime
        ]);
        console.log(searchResult.rows);
        response.json(searchResult.rows);
    } catch (err) {
        console.log(err);
        response.status(500).json({
            error: err
        });
    }
   
});

/**
 * Get all room bookings
 */
app.get("/room-booking", isLoggedIn, async (request: any, response: any) => {
    // build and send query
    try {
      var getBookingsQuery = `SELECT * FROM room_bookings;`;
      const bookingsResult = await pool.query(getBookingsQuery);
      console.log(bookingsResult.rows);
      response.json(bookingsResult.rows);
    } catch (err) {
      console.log(err);
      response.status(500).json({
        error: err
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
app.post("/room-booking", isLoggedIn, async (request: any, response: any) => {
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
        error: `Error: booking duration exceeds the alloted max of ${max_duration} minutes.`
    });
  }
  if (num_occupants > max_occupants) {
    response.status(500).json({
        error: `Error: number of occupants exceed the alloted max of ${max_occupants}.`
    });
  }

  // make sure building and room exists in the rooms table
  try {
    var getRoomQuery = `SELECT * FROM rooms WHERE building_name=$1 AND room_number=$2`;
    const roomResult = await pool.query(getRoomQuery, [
      building_name,
      room_number,
    ]);

    if (roomResult.rowCount == 0) {
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
        error: err
    });
  }

  // calculate endtime
  let end_datetime = calculateEndTime(start_datetime, duration);

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
        error: err
    });
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
