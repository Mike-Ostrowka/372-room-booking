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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = require("express");
var index_1 = __importDefault(require("../index"));
// middleware and util functions
var isLoggedIn_1 = __importDefault(require("./middleware/isLoggedIn"));
var calcTime_1 = __importDefault(require("./utils/calcTime"));
var roomBookingRouter = (0, express_1.Router)();
/**
 * Get all room bookings
 */
roomBookingRouter.get("/", isLoggedIn_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var getBookingsQuery, bookingsResult, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                getBookingsQuery = "SELECT * FROM room_bookings;";
                return [4 /*yield*/, index_1["default"].query(getBookingsQuery)];
            case 1:
                bookingsResult = _a.sent();
                console.log(bookingsResult.rows);
                response.status(200).json(bookingsResult.rows);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                console.log(err_1);
                response.status(500).json({
                    error: err_1
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
/**
 * Get all room bookings for a given user
 * Endpt: /room-booking/<user_id>
 * Sample request body:
 * {
 *  user_id: 27
 * }
 */
roomBookingRouter.get("/:user_id", isLoggedIn_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, getBookingsQuery, bookingsResult, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = request.params.user_id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                getBookingsQuery = "SELECT * FROM room_bookings WHERE user_id=$1;";
                return [4 /*yield*/, index_1["default"].query(getBookingsQuery, [user_id])];
            case 2:
                bookingsResult = _a.sent();
                console.log(bookingsResult.rows);
                response.status(200).json(bookingsResult.rows);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                console.log(err_2);
                response.status(500).json({
                    error: err_2
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
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
roomBookingRouter.post("/", isLoggedIn_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
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
                return [4 /*yield*/, index_1["default"].query(getRoomQuery, [
                        building_name,
                        room_number,
                    ])];
            case 2:
                roomResult = _a.sent();
                if (roomResult.rowCount === 0) {
                    console.log("Error: this room does not exist in the database. please enter a valid building name and room number.");
                    response.status(500).json({
                        error: "Error: this room does not exist in the database. please enter a valid building name and room number."
                    });
                    return [2 /*return*/];
                }
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                console.log(err_3);
                response.status(500).json({
                    error: err_3
                });
                return [3 /*break*/, 4];
            case 4:
                end_datetime = calcTime_1["default"].calculateEndTime(start_datetime, duration);
                _a.label = 5;
            case 5:
                _a.trys.push([5, 7, , 8]);
                addBookingQuery = "INSERT INTO room_bookings (start_datetime, end_datetime, duration, num_occupants, building_name, room_number, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7);";
                return [4 /*yield*/, index_1["default"].query(addBookingQuery, [
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
                response.status(200).json(bookingResult.rows);
                return [3 /*break*/, 8];
            case 7:
                err_4 = _a.sent();
                console.log(err_4);
                response.status(500).json({
                    error: err_4
                });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
/**
 * Cancel a room booking
 * Sample request body format:
 * {
 *  booking_id: 88,
 *  user_id: 27
 * }
 * Constraints:
 * - Booking must exist and must belong to the user
 * - Must be a future booking
 */
roomBookingRouter["delete"]("/", isLoggedIn_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var booking_id, user_id, getBookingQuery, getBookingResult, booking_start, err_5, deleteBookingQuery, deleteResult, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                booking_id = request.body.booking_id;
                user_id = request.body.user_id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                getBookingQuery = "SELECT start_datetime FROM room_bookings WHERE booking_id=$1 AND user_id=$2;";
                return [4 /*yield*/, index_1["default"].query(getBookingQuery, [booking_id, user_id])];
            case 2:
                getBookingResult = _a.sent();
                if (getBookingResult.rowCount === 0) {
                    console.log("Error: Either this room booking does not exist, or it does not belong to this user.");
                    response.status(400).json({
                        error: "Error: Either this room booking does not exist, or it does not belong to this user.."
                    });
                    return [2 /*return*/];
                }
                else {
                    booking_start = getBookingResult.rows[0].start_datetime;
                    if (!calcTime_1["default"].isFutureDate(booking_start)) {
                        console.log("Error: Only future bookings may be cancelled.");
                        response.status(400).json({
                            error: "Error: Only future bookings may be cancelled."
                        });
                        return [2 /*return*/];
                    }
                }
                return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                console.log(err_5);
                response.status(500).json({
                    error: err_5
                });
                return [3 /*break*/, 4];
            case 4:
                _a.trys.push([4, 6, , 7]);
                deleteBookingQuery = "DELETE FROM room_bookings WHERE booking_id=$1;";
                return [4 /*yield*/, index_1["default"].query(deleteBookingQuery, [booking_id])];
            case 5:
                deleteResult = _a.sent();
                console.log(deleteResult.rows);
                response.status(200).json(deleteResult.rows);
                return [3 /*break*/, 7];
            case 6:
                err_6 = _a.sent();
                console.log(err_6);
                response.status(500).json({
                    error: err_6
                });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
exports["default"] = roomBookingRouter;
