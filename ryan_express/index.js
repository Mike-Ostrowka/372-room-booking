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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var express = require("express");
var md5 = require("md5");
var session = require("express-session");
var cors = require("cors");
var Pool = require("pg").Pool;
var app = express();
var corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
var port = process.env.PORT || 8080;
var pool = new Pool({
    host: "34.82.200.170",
    user: "testuser",
    password: "password",
    database: "room_booking_app",
});
app.use(session({
    name: "session",
    secret: "testsecretpleasechange",
    resave: false,
    maxAge: 30 * 60 * 1000,
    saveUninitialized: true,
}));
// Middleware to check if the user is logged in
function isLoggedIn(request, response, next) {
    if (request.session.user) {
        console.log("isLoggedIn");
        return next();
    }
    else {
        console.log("Not logged in.");
        response.json({ success: false });
    }
}
//check if user exists
function isUser(username) {
    return __awaiter(this, void 0, void 0, function () {
        var authenticationQuery, result, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    authenticationQuery = "SELECT json_agg(a) FROM users a WHERE username = $1";
                    return [4 /*yield*/, pool.query(authenticationQuery, [username])];
                case 1:
                    result = _a.sent();
                    if (result.rows.length > 0 && result.rows[0].json_agg != null) {
                        return [2 /*return*/, true];
                    }
                    else {
                        return [2 /*return*/, false];
                    }
                    return [3 /*break*/, 3];
                case 2:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Calculate and format the endtime, 
// given a booking start time and duration
function calculateEndTime(start_time, duration) {
    var start = new Date(start_time);
    var end = new Date(start.getTime() + duration * 60000);
    // format end time to psql ISO date format
    var end_formatted = end.getFullYear() + '-' + (end.getMonth() + 1) + '-' + end.getDate() + ' ' + end.getHours() + ':' + end.getMinutes();
    return end_formatted;
}
app.use("/", function (req, res, next) {
    console.log(req.method, "request: ", req.url, JSON.stringify(req.body));
    next();
});
app.post("/register-api", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var firstName, lastName, username, password, isStaff, registerQuery, result, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                firstName = request.body.firstName;
                lastName = request.body.lastName;
                username = request.body.username;
                password = md5(request.body.password);
                isStaff = request.body.isStaff || "0";
                return [4 /*yield*/, isUser(username)];
            case 1:
                if (_a.sent()) {
                    console.log("user already exists");
                    response.json({ success: false });
                    return [2 /*return*/];
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                registerQuery = "INSERT INTO users (username, password, firstname, lastname, isstaff) VALUES ($1, $2, $3, $4, $5)";
                console.log(registerQuery);
                return [4 /*yield*/, pool.query(registerQuery, [
                        username,
                        password,
                        firstName,
                        lastName,
                        isStaff,
                    ])];
            case 3:
                result = _a.sent();
                if ((result.rowCount = 1)) {
                    console.log("registered user");
                    response.json({ success: true });
                }
                else {
                    console.log("failed to register user");
                    response.json({ success: false });
                }
                return [3 /*break*/, 5];
            case 4:
                e_2 = _a.sent();
                console.log(e_2);
                response.end(e_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.post("/login-api", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var hashedpw, username, authenticationQuery, result, userObject, properObject_1, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                hashedpw = md5(request.body.password);
                username = request.body.username;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                authenticationQuery = "SELECT json_agg(a) FROM users a WHERE username = $1 AND password = $2";
                return [4 /*yield*/, pool.query(authenticationQuery, [username, hashedpw])];
            case 2:
                result = _a.sent();
                if (result.rows.length > 0 && result.rows[0].json_agg != null) {
                    userObject = result.rows[0].json_agg[0];
                    properObject_1 = {
                        u_id: userObject["user_id"],
                        u: userObject["username"],
                        p: userObject["password"],
                        success: true,
                    };
                    request.session.regenerate(function (err) {
                        if (err) {
                            console.log(err);
                            response.status(500).send("Error regenerating session");
                        }
                        else {
                            request.session.user = properObject_1;
                            response.json(properObject_1);
                        }
                    });
                }
                else {
                    console.log("Failed to login!");
                    response.json({ success: false });
                }
                return [3 /*break*/, 4];
            case 3:
                e_3 = _a.sent();
                console.log(e_3);
                response.end(e_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
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
app.post("/search-rooms", isLoggedIn, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var start_datetime, duration, num_occupants, hasprojector, haswhiteboard, getRoomsQuery, end_datetime, getBookingsQuery, searchQuery, searchResult, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                start_datetime = request.body.start_datetime;
                duration = request.body.duration;
                num_occupants = request.body.num_occupants;
                hasprojector = request.body.hasprojector;
                haswhiteboard = request.body.haswhiteboard;
                getRoomsQuery = "SELECT * FROM rooms WHERE capacity >= $1 ";
                // only add projector/whiteboard if requested by the user
                // e.g. if we want a projector, but didn't request a whiteboard, still include rooms that have a whiteboard,
                // so we can broaden our search and return more rooms
                if (hasprojector) {
                    getRoomsQuery += " AND hasprojector=true";
                }
                if (haswhiteboard) {
                    getRoomsQuery += " AND haswhiteboard=true";
                }
                end_datetime = calculateEndTime(start_datetime, duration);
                getBookingsQuery = "SELECT building_name, room_number FROM room_bookings WHERE booking_datetime >= $2 and booking_datetime < $3";
                searchQuery = "SELECT * FROM (".concat(getRoomsQuery, ") AS r \n        WHERE NOT EXISTS (\n            SELECT * FROM (").concat(getBookingsQuery, ") as b \n            WHERE b.building_name=r.building_name AND b.room_number=r.room_number\n        );");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, pool.query(searchQuery, [
                        num_occupants,
                        start_datetime,
                        end_datetime
                    ])];
            case 2:
                searchResult = _a.sent();
                console.log(searchResult.rows);
                response.json(searchResult.rows);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                response.end(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * Get all room bookings
 */
app.get("/room-booking", isLoggedIn, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var getBookingsQuery, bookingsResult, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                getBookingsQuery = "SELECT * FROM room_bookings;";
                return [4 /*yield*/, pool.query(getBookingsQuery)];
            case 1:
                bookingsResult = _a.sent();
                console.log(bookingsResult.rows);
                response.json(bookingsResult.rows);
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.log(err_2);
                response.end(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
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
app.post("/room-booking", isLoggedIn, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var start_datetime, duration, num_occupants, building_name, room_number, user_id, max_duration, max_occupants, getRoomQuery, roomResult, err_3, end_datetime, addBookingQuery, bookingResult, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                start_datetime = request.body.start_datetime;
                duration = request.body.duration;
                num_occupants = request.body.num_occupants;
                building_name = request.body.building_name;
                room_number = request.body.room_number;
                user_id = request.body.user_id;
                max_duration = 60 * 3;
                max_occupants = 25;
                if (duration > max_duration) {
                    response.status(500).json({
                        error: "Error: booking duration exceeds the alloted max of ".concat(max_duration, " minutes.")
                    });
                }
                if (num_occupants > max_occupants) {
                    response.status(500).json({
                        error: "Error: number of occupants exceed the alloted max of ".concat(max_occupants, ".")
                    });
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                getRoomQuery = "SELECT * FROM rooms WHERE building_name=$1 AND room_number=$2";
                return [4 /*yield*/, pool.query(getRoomQuery, [
                        building_name,
                        room_number,
                    ])];
            case 2:
                roomResult = _a.sent();
                if (roomResult.rowCount == 0) {
                    console.log("Error: this room does not exist in the database. please enter a valid building name and room number.");
                    response.status(500).json({
                        error: "Error: this room does not exist in the database. please enter a valid building name and room number.",
                    });
                    return [2 /*return*/];
                }
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.log(err_3);
                response.end(err_3);
                return [3 /*break*/, 4];
            case 4:
                end_datetime = calculateEndTime(start_datetime, duration);
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                addBookingQuery = "INSERT INTO room_bookings (start_datetime, end_datetime, duration, num_occupants, building_name, room_number, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7);";
                return [4 /*yield*/, pool.query(addBookingQuery, [
                        start_datetime,
                        end_datetime,
                        duration,
                        num_occupants,
                        building_name,
                        room_number,
                        user_id,
                    ])];
            case 6:
                bookingResult = _a.sent();
                console.log(bookingResult.rows);
                response.json(bookingResult.rows);
                return [3 /*break*/, 8];
            case 7:
                err_4 = _a.sent();
                console.log(err_4);
                response.end(err_4);
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("App running on port ".concat(port));
});
