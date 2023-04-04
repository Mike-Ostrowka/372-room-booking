"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var express_session_1 = __importDefault(require("express-session"));
var cors_1 = __importDefault(require("cors"));
var pg_1 = __importDefault(require("pg"));
var path_1 = __importDefault(require("path"));
var register_1 = __importDefault(require("./routes/register"));
var login_1 = __importDefault(require("./routes/login"));
var searchRooms_1 = __importDefault(require("./routes/searchRooms"));
var roomBooking_1 = __importDefault(require("./routes/roomBooking"));
var rooms_1 = __importDefault(require("./routes/rooms"));
var roomReview_1 = __importDefault(require("./routes/roomReview"));
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
app.use(express_1["default"].static(path_1["default"].join(__dirname, 'dist')));
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
app.get("/", function (request, response) {
    response.sendFile(path_1["default"].join(__dirname, 'dist', 'index.html'));
});
app.get("/statistics", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var review_count_query, current_room_bookings_query, total_rooms_query, today, week_in_the_future, result, review_count, current_room_bookings, total_rooms, available_rooms, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (request.session.user == null) {
                    response.send({ statistics: false });
                }
                console.log(request.session.user.u_id);
                review_count_query = 'SELECT COUNT(*) FROM room_reviews INNER JOIN (SELECT booking_id, user_id from room_bookings) bookings ON room_reviews.booking_id = bookings.booking_id and bookings.user_id = $1;';
                current_room_bookings_query = "SELECT COUNT(DISTINCT (room_number, building_name)) from room_bookings where start_datetime < $1 and $1 < end_datetime;";
                total_rooms_query = "SELECT COUNT(*) FROM rooms";
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                today = new Date();
                week_in_the_future = new Date();
                week_in_the_future.setDate(week_in_the_future.getDate() + 7);
                return [4 /*yield*/, pool.query(review_count_query, [request.session.user.u_id])];
            case 2:
                result = _a.sent();
                review_count = Number(result.rows[0]['count']);
                return [4 /*yield*/, pool.query(current_room_bookings_query, [today])];
            case 3:
                //get total available rooms
                result = _a.sent();
                current_room_bookings = Number(result.rows[0]['count']);
                return [4 /*yield*/, (pool.query(total_rooms_query))];
            case 4:
                result = _a.sent();
                total_rooms = Number(result.rows[0]['count']);
                available_rooms = total_rooms - current_room_bookings;
                response.send({ reviews: review_count, available: available_rooms });
                return [3 /*break*/, 6];
            case 5:
                e_1 = _a.sent();
                response.send(e_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
// Register a user
app.use("/register-api", register_1["default"]);
// Log in
app.use("/login-api", login_1["default"]);
// Search for available rooms
app.use("/search-rooms", searchRooms_1["default"]);
// Room bookings
app.use("/room-booking", roomBooking_1["default"]);
// Rooms
app.use("/rooms", rooms_1["default"]);
// Room reviews
app.use("/room-review", roomReview_1["default"]);
app.listen(port, function () {
    console.log("App running on port ".concat(port));
});
exports["default"] = pool;
