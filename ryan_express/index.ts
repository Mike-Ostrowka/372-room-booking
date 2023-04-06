import express from "express";
import session from "express-session";
import cors from "cors";
import pg from "pg";

import registerRouter from "./routes/register";
import loginRouter from "./routes/login";
import logoutRouter from "./routes/logout";
import searchRoomsRouter from "./routes/searchRooms";
import roomBookingRouter from "./routes/roomBooking";
import roomsRouter from "./routes/rooms";
import roomReviewRouter from "./routes/roomReview";
import lostAndFoundRouter from "./routes/lostAndFound";
import statisticsRouter from "./routes/statistics";

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
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
    saveUninitialized: true,
  })
);

app.use("/", function (req: any, res: any, next: any) {
  console.log(req.method, "request: ", req.url, JSON.stringify(req.body));
  next();
});

// Get room statistics
app.use("/statistics", statisticsRouter);

// Register a user
app.use("/register-api", registerRouter);

// Log in
app.use("/login-api", loginRouter);

// log out
app.use("/logout-api", logoutRouter);

// Search for available rooms
app.use("/search-rooms", searchRoomsRouter);

// Room bookings
app.use("/room-booking", roomBookingRouter);

// Rooms
app.use("/rooms", roomsRouter);

// Room reviews
app.use("/room-review", roomReviewRouter);

// Lost and Found
app.use("/lost-and-found", lostAndFoundRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

export default pool;
