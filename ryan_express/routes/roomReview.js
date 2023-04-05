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
var express_1 = require("express");
var index_1 = __importDefault(require("../index"));
// middleware and util functions
var isLoggedIn_1 = __importDefault(require("./middleware/isLoggedIn"));
var calcTime_1 = __importDefault(require("./utils/calcTime"));
var roomReviewRouter = (0, express_1.Router)();
/**
 * Get all room reviews
 */
roomReviewRouter.get("/", isLoggedIn_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var getReviewsQuery, reviewsResult, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                getReviewsQuery = "SELECT * FROM room_reviews;";
                return [4 /*yield*/, index_1["default"].query(getReviewsQuery)];
            case 1:
                reviewsResult = _a.sent();
                console.log(reviewsResult.rows);
                response.status(200).json(reviewsResult.rows);
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
 * Get all reviews for a particular room
 * Endpt: /room-review/room
 * Sample request body:
 * {
 *  building_name: "SUB",
 *  room_number: 4001
 * }
 */
roomReviewRouter.get("/room", isLoggedIn_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var building_name, room_number, getRoomQuery, roomResult, err_2, getReviewsQuery, reviewsResult, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                building_name = request.body.building_name;
                room_number = request.body.room_number;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                getRoomQuery = "SELECT * FROM rooms WHERE building_name=$1 AND room_number=$2";
                return [4 /*yield*/, index_1["default"].query(getRoomQuery, [building_name, room_number])];
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
                err_2 = _a.sent();
                console.log(err_2);
                response.status(500).json({
                    error: err_2
                });
                return [3 /*break*/, 4];
            case 4:
                _a.trys.push([4, 6, , 7]);
                getReviewsQuery = "SELECT room_reviews.* FROM room_reviews \n        INNER JOIN room_bookings ON room_reviews.booking_id=room_bookings.booking_id \n        WHERE building_name=$1 \n        AND room_number=$2;";
                return [4 /*yield*/, index_1["default"].query(getReviewsQuery, [building_name, room_number])];
            case 5:
                reviewsResult = _a.sent();
                console.log(reviewsResult.rows);
                response.json(reviewsResult.rows);
                return [3 /*break*/, 7];
            case 6:
                err_3 = _a.sent();
                console.log(err_3);
                response.status(500).json({
                    error: err_3
                });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
/**
 * Add a new room review
 * Sample request body format:
 * {
 *  review: 'was a nice room.',
 *  room_rating: 5,
 *  noise_level: 'quiet',
 *  functioning_room: false,
 *  issue_details: 'outlets were not working',
 *  booking_id: 88
 * }
 * Constraints:
 * - Reviews can only be made for past bookings
 * - 1 review per booking
 * - Booking must exist
 */
roomReviewRouter.post("/", isLoggedIn_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var review, room_rating, noise_level, functioning_room, issue_details, booking_id, getReviewsQuery, getReviewsResult, err_4, getBookingsQuery, getBookingsResult, endTime, err_5, addReviewQuery, reviewsResult, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                review = request.body.review;
                room_rating = request.body.room_rating;
                noise_level = request.body.noise_level;
                functioning_room = request.body.functioning_room;
                issue_details = request.body.issue_details;
                booking_id = request.body.booking_id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                getReviewsQuery = "SELECT * FROM room_reviews WHERE booking_id=$1;";
                return [4 /*yield*/, index_1["default"].query(getReviewsQuery, [booking_id])];
            case 2:
                getReviewsResult = _a.sent();
                if (getReviewsResult.rowCount > 0) {
                    console.log("Error: A room review already exists for this booking.");
                    response.status(400).json({
                        error: "Error: A room review already exists for this booking."
                    });
                    return [2 /*return*/];
                }
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                console.log(err_4);
                response.status(500).json({
                    error: err_4
                });
                return [3 /*break*/, 4];
            case 4:
                _a.trys.push([4, 6, , 7]);
                getBookingsQuery = "SELECT * FROM room_bookings WHERE booking_id=$1;";
                return [4 /*yield*/, index_1["default"].query(getBookingsQuery, [booking_id])];
            case 5:
                getBookingsResult = _a.sent();
                if (getBookingsResult.rowCount === 0) {
                    console.log("Error: This room booking does not exist in the database.");
                    response.status(400).json({
                        error: "Error: This room booking does not exist in the database."
                    });
                    return [2 /*return*/];
                }
                else {
                    endTime = getBookingsResult.rows[0].end_datetime;
                    if (!calcTime_1["default"].isPastDate(endTime)) {
                        console.log("Error: Reviews may only be made for past bookings");
                        response.status(400).json({
                            error: "Error: Reviews may only be made for past bookings"
                        });
                        return [2 /*return*/];
                    }
                }
                return [3 /*break*/, 7];
            case 6:
                err_5 = _a.sent();
                console.log(err_5);
                response.status(500).json({
                    error: err_5
                });
                return [3 /*break*/, 7];
            case 7:
                _a.trys.push([7, 9, , 10]);
                addReviewQuery = "INSERT INTO room_reviews (review, room_rating, noise_level, functioning_room, issue_details, booking_id) VALUES ($1, $2, $3, $4, $5, $6);";
                return [4 /*yield*/, index_1["default"].query(addReviewQuery, [
                        review,
                        room_rating,
                        noise_level,
                        functioning_room,
                        issue_details,
                        booking_id,
                    ])];
            case 8:
                reviewsResult = _a.sent();
                console.log(reviewsResult.rows);
                response.json(reviewsResult.rows);
                return [3 /*break*/, 10];
            case 9:
                err_6 = _a.sent();
                console.log(err_6);
                response.status(500).json({
                    error: err_6
                });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
exports["default"] = roomReviewRouter;
