import express from "express";
import md5 from "md5";
import session from "express-session";
import cors from "cors";
import pg from "pg";

import loginRouter from "./routes/login";
import searchRoomsRouter from './routes/searchRooms';
import roomBookingRouter from "./routes/roomBooking";

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
    cookie: { maxAge: 30 * 60 * 1000 },
    saveUninitialized: true,
  })
);

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


app.use("/", function (req: any, res: any, next: any) {
  console.log(req.method, "request: ", req.url, JSON.stringify(req.body));
  next();
});

app.post("/register-api", async (request: any, response: any) => {
  let firstName: string = request.body.firstName;
  let lastName: string = request.body.lastName;
  let username: string = request.body.username;
  let password: string = md5(request.body.password);
  let isStaff: boolean = request.body.isStaff;

  if (await isUser(username)) {
    console.log("user already exists");
    response.json({ success: false, userExists: true });
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
      response.json({ success: true, userExists: false });
    } else {
      console.log("failed to register user");
      response.json({ success: false, userExists: false });
    }
  } catch (e) {
    console.log(e);
    response.end(e);
  }
});

// log in
app.use('/login-api', loginRouter);

// Search for available rooms
app.use('/search-rooms', searchRoomsRouter);

// Room bookings
app.use('/room-booking', roomBookingRouter);


app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

export default pool;
