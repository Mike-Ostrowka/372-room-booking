const express = require("express");
const md5 = require("md5");
const session = require("express-session");
const cors = require("cors");
const { Pool } = require("pg");

let app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let port = process.env.PORT || 8080;

let pool = new Pool({
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
    cookie: { maxAge: 30 * 60 * 1000 },
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", function (req: any, res: any, next: any) {
  console.log(req.method, "request: ", req.url, JSON.stringify(req.body));
  next();
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
        u: userObject["username"],
        p: userObject["password"],
      };
      request.session.user = properObject;
      request.session.regenerate((err: any) => {
        if (err) {
          console.log(err);
          response.status(500).send("Error regenerating session");
        } else {
          response.json({ success: true });
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
 *  booking_datetime: 'YYYY-MM-DD HH:MM',
 *  duration: 120,
 *  num_occupants: 2,
 *  hasprojector: true,
 *  haswhiteboard: false
 * }
 */
app.post("/search-rooms", isLoggedIn, async (request: any, response: any) => {
    // parse form data
    let booking_datetime: string = request.body.booking_datetime;
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
    let start = new Date(booking_datetime);
    let end = new Date(start.getTime() + duration * 60000);

    // format end time to psql ISO date format
    let end_formatted = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate() + ' ' + end.getHours() + ':' + end.getMinutes();
    console.log(end_formatted);

    let getBookingsQuery = `SELECT building_name, room_number FROM room_bookings WHERE booking_datetime >= $2 and booking_datetime < $3`

    // part 3: build and send query
    let searchQuery = `SELECT * FROM (${getRoomsQuery}) AS r 
        WHERE NOT EXISTS (
            SELECT * FROM (${getBookingsQuery}) as b 
            WHERE b.building_name=r.building_name AND b.room_number=r.room_number
        );`
    try {
        const searchResult = await pool.query(searchQuery, [
            num_occupants,
            booking_datetime,
            end_formatted
        ]);
        console.log(searchResult.rows);
        response.json(searchResult.rows);
    } catch (err) {
        console.log(err);
        response.end(err);
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
      response.end(err);
    }
  });

/**
 * Add a new room booking
 * Building name, room number must exist in the db
 * Sample request body format:
 * {
 *  booking_datetime: 'YYYY-MM-DD HH:MM'
 *  duration: 120
 *  num_occupants: 2
 *  building_name: 'SUB'
 *  room_number: 2120
 *  user_id: 1
 * }
 */
app.post("/room-booking", isLoggedIn, async (request: any, response: any) => {
  // parse form data
  let booking_datetime: string = request.body.booking_datetime;
  let duration: number = request.body.duration;
  let num_occupants: number = request.body.num_occupants;
  let building_name: string = request.body.building_name;
  let room_number: number = request.body.room_number;
  let user_id: number = request.body.user_id;

  // make sure user exists
//   try {
//     var getUserQuery = `SELECT * FROM users WHERE user_id=$1`;
//     const userResult = await pool.query(getUserQuery, [user_id]);

//     if (userResult.rowCount == 0) {
//       console.log("this user does not exist in the database.");
//       response.end("this user does not exist in the database.");
//       return;
//     }
//   } catch (err) {
//     console.log(err);
//     response.end(err);
//   }

  // make sure building and room exists in the rooms table
  try {
    var getRoomQuery = `SELECT * FROM rooms WHERE building_name=$1 AND room_number=$2`;
    const roomResult = await pool.query(getRoomQuery, [
      building_name,
      room_number,
    ]);

    if (roomResult.rowCount == 0) {
      console.log(
        "this room does not exist in the database. please enter a valid building name and room number."
      );
      response.end(
        "this room does not exist in the database. please enter a valid building name and room number."
      );
      return;
    }
  } catch (err) {
    console.log(err);
    response.end(err);
  }

  // build and send query
  try {
    var addBookingQuery = `INSERT INTO room_bookings (booking_datetime, duration, num_occupants, building_name, room_number, user_id) VALUES ($1, $2, $3, $4, $5, $6);`;
    const bookingResult = await pool.query(addBookingQuery, [
      booking_datetime,
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
    response.end(err);
  }
});

// Middleware to check if the user is logged in
function isLoggedIn(request: any, response: any, next: any) {
  let now = new Date();
  if (request.session.cookie._expires > now) {
    console.log("isLoggedIn");
    return next();
  } else {
    console.log("Not logged in.");
    response.json({ success: false });
  }
}

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
