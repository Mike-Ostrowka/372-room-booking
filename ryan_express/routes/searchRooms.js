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
var searchRoomsRouter = (0, express_1.Router)();
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
searchRoomsRouter.post("/", isLoggedIn_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
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
                end_datetime = (0, calcTime_1["default"])(start_datetime, duration);
                getBookingsQuery = "SELECT building_name, room_number FROM room_bookings WHERE (start_datetime >= $2 AND start_datetime < $3) OR (end_datetime > $4 AND end_datetime <= $5)";
                searchQuery = "SELECT * FROM (".concat(getRoomsQuery, ") AS r \n          WHERE NOT EXISTS (\n              SELECT * FROM (").concat(getBookingsQuery, ") as b \n              WHERE b.building_name=r.building_name AND b.room_number=r.room_number\n          );");
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, index_1["default"].query(searchQuery, [
                        num_occupants,
                        start_datetime,
                        end_datetime,
                        start_datetime,
                        end_datetime,
                    ])];
            case 2:
                searchResult = _a.sent();
                console.log(searchResult.rows);
                response.json(searchResult.rows);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                response.status(500).json({
                    error: err_1
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
exports["default"] = searchRoomsRouter;
