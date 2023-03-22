"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var express_session_1 = __importDefault(require("express-session"));
var cors_1 = __importDefault(require("cors"));
var pg_1 = __importDefault(require("pg"));
var register_1 = __importDefault(require("./routes/register"));
var login_1 = __importDefault(require("./routes/login"));
var searchRooms_1 = __importDefault(require("./routes/searchRooms"));
var roomBooking_1 = __importDefault(require("./routes/roomBooking"));
var app = (0, express_1["default"])();
var corsOptions = {
    origin: "http://localhost:5173",
    credentials: true
};
app.use((0, cors_1["default"])(corsOptions));
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: false }));
var port = process.env.PORT || 8080;
var pool = new pg_1["default"].Pool({
    host: "34.82.200.170",
    user: "testuser",
    password: "password",
    database: "room_booking_app"
});
app.use((0, express_session_1["default"])({
    name: "session",
    secret: "testsecretpleasechange",
    resave: false,
    cookie: { maxAge: 30 * 60 * 1000 },
    saveUninitialized: true
}));
app.use("/", function (req, res, next) {
    console.log(req.method, "request: ", req.url, JSON.stringify(req.body));
    next();
});
// Register a user
app.use('/register-api', register_1["default"]);
// Log in
app.use('/login-api', login_1["default"]);
// Search for available rooms
app.use('/search-rooms', searchRooms_1["default"]);
// Room bookings
app.use('/room-booking', roomBooking_1["default"]);
app.listen(port, function () {
    console.log("App running on port ".concat(port));
});
exports["default"] = pool;
