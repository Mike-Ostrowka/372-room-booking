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
// middleware
var isLoggedInAdmin_1 = __importDefault(require("./middleware/isLoggedInAdmin"));
var isLoggedIn_1 = __importDefault(require("./middleware/isLoggedIn"));
var roomsRouter = (0, express_1.Router)();
/**
 * Allowing administator to perform the
 * following actions for rooms:
 * -Create
 * -Read
 * -Update
 * -Delete
 */
// POST /rooms - creates a new room
roomsRouter.post("/", isLoggedInAdmin_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var building_name, room_number, has_projector, has_whiteboard, capacity, addRoomQuery, getRoomsQuery, getRoomsRes, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                building_name = request.body.building_name;
                room_number = request.body.room_number;
                has_projector = request.body.has_projector;
                has_whiteboard = request.body.has_whiteboard;
                capacity = request.body.capacity;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                addRoomQuery = "INSERT INTO rooms (building_name, room_number, hasprojector, haswhiteboard, capacity) VALUES ($1, $2, $3, $4, $5)";
                return [4 /*yield*/, index_1["default"].query(addRoomQuery, [
                        building_name,
                        room_number,
                        has_projector,
                        has_whiteboard,
                        capacity,
                    ])];
            case 2:
                _a.sent();
                getRoomsQuery = "SELECT * FROM rooms";
                return [4 /*yield*/, index_1["default"].query(getRoomsQuery)];
            case 3:
                getRoomsRes = _a.sent();
                response.json(getRoomsRes.rows);
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                console.log(e_1);
                response.status(500).json({
                    error: e_1
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// GET /rooms - gets all rooms
roomsRouter.get("/", isLoggedIn_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var getRoomsQuery, getRoomsRes, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                getRoomsQuery = "SELECT * FROM rooms";
                return [4 /*yield*/, index_1["default"].query(getRoomsQuery)];
            case 1:
                getRoomsRes = _a.sent();
                response.json(getRoomsRes.rows);
                return [3 /*break*/, 3];
            case 2:
                e_2 = _a.sent();
                console.log(e_2);
                response.status(500).json({
                    error: e_2
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// PUT /rooms/:id - updates a room
roomsRouter.put("/:room_number/:building_name", isLoggedInAdmin_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var room_number, building_name, new_room_number, new_building_name, has_projector, has_whiteboard, capacity, updateRoomQuery, getRoomsQuery, getRoomsRes, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                room_number = request.params.room_number;
                building_name = request.params.building_name;
                new_room_number = request.body.room_number;
                new_building_name = request.body.building_name;
                has_projector = request.body.has_projector;
                has_whiteboard = request.body.has_whiteboard;
                capacity = request.body.capacity;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                updateRoomQuery = "UPDATE rooms SET building_name=$1, room_number=$2, hasprojector=$3, haswhiteboard=$4, capacity=$5 WHERE room_number=$6 AND building_name=$7";
                return [4 /*yield*/, index_1["default"].query(updateRoomQuery, [
                        new_building_name,
                        new_room_number,
                        has_projector,
                        has_whiteboard,
                        capacity,
                        room_number,
                        building_name,
                    ])];
            case 2:
                _a.sent();
                getRoomsQuery = "SELECT * FROM rooms";
                return [4 /*yield*/, index_1["default"].query(getRoomsQuery)];
            case 3:
                getRoomsRes = _a.sent();
                response.json(getRoomsRes.rows);
                return [3 /*break*/, 5];
            case 4:
                e_3 = _a.sent();
                console.log(e_3);
                response.status(500).json({
                    error: e_3
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// DELETE /rooms/:id - deletes a room
roomsRouter["delete"]("/:room_number/:building_name", isLoggedInAdmin_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var room_number, building_name, deleteRoomQuery, getRoomsQuery, getRoomsRes, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                room_number = request.params.room_number;
                building_name = request.params.building_name;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                deleteRoomQuery = "DELETE FROM rooms WHERE room_number=$1 AND building_name=$2";
                return [4 /*yield*/, index_1["default"].query(deleteRoomQuery, [room_number, building_name])];
            case 2:
                _a.sent();
                getRoomsQuery = "SELECT * FROM rooms";
                return [4 /*yield*/, index_1["default"].query(getRoomsQuery)];
            case 3:
                getRoomsRes = _a.sent();
                response.json(getRoomsRes.rows);
                return [3 /*break*/, 5];
            case 4:
                e_4 = _a.sent();
                console.log(e_4);
                response.status(500).json({
                    error: e_4
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports["default"] = roomsRouter;
