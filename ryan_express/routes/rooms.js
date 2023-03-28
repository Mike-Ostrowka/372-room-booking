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
// middleware
var isLoggedIn_1 = __importDefault(require("./middleware/isLoggedIn"));
var roomsRouter = (0, express_1.Router)();
// helper function to check if user is an admin
var checkUserIsAdmin = function (user_id) { return __awaiter(void 0, void 0, void 0, function () {
    var getUserQuery, getUserRes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getUserQuery = "SELECT * FROM users WHERE user_id = $1 AND isstaff = TRUE";
                return [4 /*yield*/, index_1["default"].query(getUserQuery, [user_id])];
            case 1:
                getUserRes = _a.sent();
                if (getUserRes.rowCount == 0) {
                    return [2 /*return*/, false];
                }
                return [2 /*return*/, true];
        }
    });
}); };
/**
 * Allowing administator to perform the
 * following actions for rooms:
 * -Create
 * -Read
 * -Update
 * -Delete
 */
// POST /rooms - creates a new room
roomsRouter.post("/:id", isLoggedIn_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, building_name, room_number, has_projector, has_whiteboard, capacity, isUserAdmin, addRoomQuery, getRoomsQuery, getRoomsRes, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = request.params.id;
                building_name = request.body.building_name;
                room_number = request.body.room_number;
                has_projector = request.body.has_projector;
                has_whiteboard = request.body.has_whiteboard;
                capacity = request.body.capacity;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, checkUserIsAdmin(user_id)];
            case 2:
                isUserAdmin = _a.sent();
                if (!!isUserAdmin) return [3 /*break*/, 3];
                response.status(401).json({
                    error: "This user is not an admin"
                });
                return [3 /*break*/, 6];
            case 3:
                addRoomQuery = "INSERT INTO rooms (building_name, room_number, hasprojector, haswhiteboard, capacity) VALUES ($1, $2, $3, $4, $5)";
                return [4 /*yield*/, index_1["default"].query(addRoomQuery, [
                        building_name,
                        room_number,
                        has_projector,
                        has_whiteboard,
                        capacity,
                    ])];
            case 4:
                _a.sent();
                getRoomsQuery = "SELECT * FROM rooms";
                return [4 /*yield*/, index_1["default"].query(getRoomsQuery)];
            case 5:
                getRoomsRes = _a.sent();
                response.json(getRoomsRes.rows);
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                e_1 = _a.sent();
                console.log(e_1);
                response.status(500).json({
                    error: e_1
                });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
// GET /rooms - gets all rooms
roomsRouter.get("/:id", isLoggedIn_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, isUserAdmin, getRoomsQuery, getRoomsRes, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = request.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, checkUserIsAdmin(user_id)];
            case 2:
                isUserAdmin = _a.sent();
                if (!!isUserAdmin) return [3 /*break*/, 3];
                response.status(401).json({
                    error: "This user is not an admin"
                });
                return [3 /*break*/, 5];
            case 3:
                getRoomsQuery = "SELECT * FROM rooms";
                return [4 /*yield*/, index_1["default"].query(getRoomsQuery)];
            case 4:
                getRoomsRes = _a.sent();
                response.json(getRoomsRes.rows);
                _a.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                e_2 = _a.sent();
                console.log(e_2);
                response.status(500).json({
                    error: e_2
                });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
// PUT /rooms/:id - updates a room
roomsRouter.put("/:id", isLoggedIn_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, building_name, room_number, has_projector, has_whiteboard, capacity, isUserAdmin, updateRoomQuery, getRoomsQuery, getRoomsRes, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = request.params.id;
                building_name = request.body.building_name;
                room_number = request.body.room_number;
                has_projector = request.body.has_projector;
                has_whiteboard = request.body.has_whiteboard;
                capacity = request.body.capacity;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, checkUserIsAdmin(user_id)];
            case 2:
                isUserAdmin = _a.sent();
                if (!!isUserAdmin) return [3 /*break*/, 3];
                response.status(401).json({
                    error: "This user is not an admin"
                });
                return [3 /*break*/, 6];
            case 3:
                updateRoomQuery = "UPDATE rooms SET building_name=$1, room_number=$2, hasprojector=$3, haswhiteboard=$4, capacity=$5 WHERE room_number=$2";
                return [4 /*yield*/, index_1["default"].query(updateRoomQuery, [
                        building_name,
                        room_number,
                        has_projector,
                        has_whiteboard,
                        capacity,
                    ])];
            case 4:
                _a.sent();
                getRoomsQuery = "SELECT * FROM rooms";
                return [4 /*yield*/, index_1["default"].query(getRoomsQuery)];
            case 5:
                getRoomsRes = _a.sent();
                response.json(getRoomsRes.rows);
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                e_3 = _a.sent();
                console.log(e_3);
                response.status(500).json({
                    error: e_3
                });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
// DELETE /rooms/:id - deletes a room
roomsRouter["delete"]("/:id", isLoggedIn_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, room_number, isUserAdmin, deleteRoomQuery, getRoomsQuery, getRoomsRes, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = request.params.id;
                room_number = request.body.room_number;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                return [4 /*yield*/, checkUserIsAdmin(user_id)];
            case 2:
                isUserAdmin = _a.sent();
                if (!!isUserAdmin) return [3 /*break*/, 3];
                response.status(401).json({
                    error: "This user is not an admin"
                });
                return [3 /*break*/, 6];
            case 3:
                deleteRoomQuery = "DELETE FROM rooms WHERE room_number=$1";
                return [4 /*yield*/, index_1["default"].query(deleteRoomQuery, [room_number])];
            case 4:
                _a.sent();
                getRoomsQuery = "SELECT * FROM rooms";
                return [4 /*yield*/, index_1["default"].query(getRoomsQuery)];
            case 5:
                getRoomsRes = _a.sent();
                response.json(getRoomsRes.rows);
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                e_4 = _a.sent();
                console.log(e_4);
                response.status(500).json({
                    error: e_4
                });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
exports["default"] = roomsRouter;
