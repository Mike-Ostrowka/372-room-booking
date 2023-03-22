import express from "express";
import session from "express-session";
import cors from "cors";
import pg from "pg";
import path from 'path';

import registerRouter from "./routes/register";
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

app.use(express.static(path.join(__dirname, 'dist')));

app.use(
  session({
    name: "session",
    secret: "testsecretpleasechange",
    resave: false,
    cookie: { maxAge: 30 * 60 * 1000 },
    saveUninitialized: true,
  })
);

app.use("/", function (req: any, res: any, next: any) {
  console.log(req.method, "request: ", req.url, JSON.stringify(req.body));
  next();
});

app.get("/", (request:any, response:any) => {
  response.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Register a user
app.use('/register-api', registerRouter);

// Log in
app.use('/login-api', loginRouter);

// Search for available rooms
app.use('/search-rooms', searchRoomsRouter);

// Room bookings
app.use('/room-booking', roomBookingRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

export default pool;
