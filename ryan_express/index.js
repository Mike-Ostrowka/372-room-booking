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
// const express = require("express");
var express_1 = __importDefault(require("express"));
// const md5 = require("md5");
var md5_1 = __importDefault(require("md5"));
var express_session_1 = __importDefault(require("express-session"));
// const session = require("express-session");
// import cors from 'cors';
var cors = require("cors");
var pg_1 = __importDefault(require("pg"));
// const { Pool } = require("pg");
var app = (0, express_1["default"])();
app.use(cors());
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
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: false }));
app.use("/", function (req, res, next) {
    console.log(req.method, "request: ", req.url, JSON.stringify(req.body));
    next();
});
app.post("/login-api", function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var hashedpw, username, authenticationQuery, result, userObject, properObject, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                hashedpw = (0, md5_1["default"])(request.body.password);
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
                    properObject = {
                        u: userObject["username"],
                        p: userObject["password"]
                    };
                    request.session.user = properObject;
                    request.session.regenerate(function (err) {
                        if (err) {
                            console.log(err);
                            response.status(500).send("Error regenerating session");
                        }
                        else {
                            response.json({ success: true });
                        }
                    });
                }
                else {
                    console.log("Failed to login!");
                    response.json({ success: false });
                }
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                console.log(e_1);
                response.end(e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
/**
 * Get all room bookings
 */
app.get("/room-booking", isLoggedIn, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var getBookingsQuery, bookingsResult, err_1;
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
                err_1 = _a.sent();
                console.log(err_1);
                response.end(err_1);
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
 *  booking_datetime: 'YYYY-MM-DD HH:MM'
 *  duration: 120
 *  num_occupants: 2
 *  building_name: 'SUB'
 *  room_number: 2120
 *  user_id: 1
 * }
 */
app.post("/room-booking", isLoggedIn, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var booking_datetime, duration, num_occupants, building_name, room_number, user_id, getUserQuery, userResult, err_2, getRoomQuery, roomResult, err_3, addBookingQuery, bookingResult, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                booking_datetime = request.body.booking_datetime;
                duration = request.body.duration;
                num_occupants = request.body.num_occupants;
                building_name = request.body.building_name;
                room_number = request.body.room_number;
                user_id = request.body.user_id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                getUserQuery = "SELECT * FROM users WHERE user_id=$1";
                return [4 /*yield*/, pool.query(getUserQuery, [user_id])];
            case 2:
                userResult = _a.sent();
                if (userResult.rowCount == 0) {
                    console.log("this user does not exist in the database.");
                    response.end("this user does not exist in the database.");
                    return [2 /*return*/];
                }
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.log(err_2);
                response.end(err_2);
                return [3 /*break*/, 4];
            case 4:
                _a.trys.push([4, 6, , 7]);
                getRoomQuery = "SELECT * FROM rooms WHERE building_name=$1 AND room_number=$2";
                return [4 /*yield*/, pool.query(getRoomQuery, [
                        building_name,
                        room_number,
                    ])];
            case 5:
                roomResult = _a.sent();
                if (roomResult.rowCount == 0) {
                    console.log("this room does not exist in the database. please enter a valid building name and room number.");
                    response.end("this room does not exist in the database. please enter a valid building name and room number.");
                    return [2 /*return*/];
                }
                return [3 /*break*/, 7];
            case 6:
                err_3 = _a.sent();
                console.log(err_3);
                response.end(err_3);
                return [3 /*break*/, 7];
            case 7:
                _a.trys.push([7, 9, , 10]);
                addBookingQuery = "INSERT INTO room_bookings (booking_datetime, duration, num_occupants, building_name, room_number, user_id) VALUES ($1, $2, $3, $4, $5, $6);";
                return [4 /*yield*/, pool.query(addBookingQuery, [
                        booking_datetime,
                        duration,
                        num_occupants,
                        building_name,
                        room_number,
                        user_id,
                    ])];
            case 8:
                bookingResult = _a.sent();
                console.log(bookingResult.rows);
                response.json(bookingResult.rows);
                return [3 /*break*/, 10];
            case 9:
                err_4 = _a.sent();
                console.log(err_4);
                response.end(err_4);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
// Middleware to check if the user is logged in
function isLoggedIn(request, response, next) {
    var now = new Date();
    if (request.session.cookie._expires > now) {
        console.log("isLoggedIn");
        return next();
    }
    else {
        console.log("Not logged in.");
        response.json({ success: false });
    }
}
app.listen(port, function () {
    console.log("App running on port ".concat(port));
});
