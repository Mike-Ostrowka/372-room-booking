import express from "express";
import session from "express-session";
import cors from "cors";
import pg from "pg";

import registerRouter from "./routes/register";
import loginRouter from "./routes/login";
import searchRoomsRouter from "./routes/searchRooms";
import roomBookingRouter from "./routes/roomBooking";
import roomsRouter from "./routes/rooms";
import roomReviewRouter from "./routes/roomReview";

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

app.use("/", function (req: any, res: any, next: any) {
  console.log(req.method, "request: ", req.url, JSON.stringify(req.body));
  next();
});

app.get("/statistics", async (request:any, response:any) => {
  
  if(request.session.user == null){
    response.send({statistics: false});
  }
  console.log(request.session.user.u_id);
  const review_count_query:string = 'SELECT COUNT(*) FROM room_reviews INNER JOIN (SELECT booking_id, user_id from room_bookings) bookings ON room_reviews.booking_id = bookings.booking_id and bookings.user_id = $1;';
  const current_room_bookings_query:string = "SELECT COUNT(DISTINCT (room_number, building_name)) from room_bookings where start_datetime < $1 and $1 < end_datetime;";
  const total_rooms_query:string = "SELECT COUNT(*) FROM rooms";
  try{
    let today = new Date();
    let week_in_the_future = new Date();
    week_in_the_future.setDate(week_in_the_future.getDate() + 7);

    //get review counts
    let result = await pool.query(review_count_query, [request.session.user.u_id]);
    let review_count:number = Number(result.rows[0]['count']);

    //get total available rooms
    result = await pool.query(current_room_bookings_query, [today]);
    let current_room_bookings:number = Number(result.rows[0]['count']);
    result = await(pool.query(total_rooms_query));
    let total_rooms:number = Number(result.rows[0]['count']);
    let available_rooms:Number = total_rooms - current_room_bookings;

    response.send({reviews: review_count, available: available_rooms});
  }catch(e){
    response.send(e);
  }
});

// Register a user
app.use("/register-api", registerRouter);

// Log in
app.use("/login-api", loginRouter);

// Search for available rooms
app.use("/search-rooms", searchRoomsRouter);

// Room bookings
app.use("/room-booking", roomBookingRouter);

// Rooms
app.use("/rooms", roomsRouter);

// Room reviews
app.use("/room-review", roomReviewRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

export default pool;
