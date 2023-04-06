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
var isLoggedInAdmin_1 = __importDefault(require("./middleware/isLoggedInAdmin"));
var isLoggedIn_1 = __importDefault(require("./middleware/isLoggedIn"));
var lostAndFoundRouter = (0, express_1.Router)();
// POST /lost-and-found - creates a new lost item
lostAndFoundRouter.post("/", isLoggedIn_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var item_name, item_description, user_id, addLostItemQuery, getLostItemsQuery, getLostItemsRes, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                item_name = request.body.item_name;
                item_description = request.body.item_description;
                user_id = request.body.user_id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                addLostItemQuery = "INSERT INTO lost_items (item_name, item_description, user_id) VALUES ($1, $2, $3)";
                return [4 /*yield*/, index_1["default"].query(addLostItemQuery, [
                        item_name,
                        item_description,
                        user_id,
                    ])];
            case 2:
                _a.sent();
                getLostItemsQuery = "SELECT * FROM lost_items WHERE user_id=$1";
                return [4 /*yield*/, index_1["default"].query(getLostItemsQuery, [user_id])];
            case 3:
                getLostItemsRes = _a.sent();
                response.json(getLostItemsRes.rows);
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
// GET /lost-and-found - gets all lost items
lostAndFoundRouter.get("/", isLoggedInAdmin_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var getLostItemsQuery, getLostItemsRes, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                getLostItemsQuery = "SELECT * FROM lost_items";
                return [4 /*yield*/, index_1["default"].query(getLostItemsQuery)];
            case 1:
                getLostItemsRes = _a.sent();
                response.json(getLostItemsRes.rows);
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
// GET /lost-and-found/:id - gets all lost items for a user
lostAndFoundRouter.get("/:id", isLoggedIn_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var user_id, getLostItemsQuery, getLostItemsRes, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user_id = request.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                getLostItemsQuery = "SELECT * FROM lost_items WHERE user_id = $1";
                return [4 /*yield*/, index_1["default"].query(getLostItemsQuery, [user_id])];
            case 2:
                getLostItemsRes = _a.sent();
                response.json(getLostItemsRes.rows);
                return [3 /*break*/, 4];
            case 3:
                e_3 = _a.sent();
                console.log(e_3);
                response.status(500).json({
                    error: e_3
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// PUT /lost-and-found/:id - updates a lost item
lostAndFoundRouter.put("/:id", isLoggedIn_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var lost_item_id, item_name, item_description, updateLostItemQuery, getLostItemsQuery, getLostItemsRes, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                lost_item_id = request.params.id;
                item_name = request.body.item_name;
                item_description = request.body.item_description;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                updateLostItemQuery = "UPDATE lost_items SET item_name=$1, item_description=$2 WHERE id=$3";
                return [4 /*yield*/, index_1["default"].query(updateLostItemQuery, [
                        item_name,
                        item_description,
                        lost_item_id,
                    ])];
            case 2:
                _a.sent();
                getLostItemsQuery = "SELECT * FROM lost_items";
                return [4 /*yield*/, index_1["default"].query(getLostItemsQuery)];
            case 3:
                getLostItemsRes = _a.sent();
                response.json(getLostItemsRes.rows);
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
// PUT /lost-and-found/status/:id - updates status of a lost item
lostAndFoundRouter.put("/status/:id", isLoggedInAdmin_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var lost_item_id, item_found, updateLostItemQuery, getLostItemsQuery, getLostItemsRes, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                lost_item_id = request.params.id;
                item_found = request.body.item_found;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                updateLostItemQuery = "UPDATE lost_items SET item_found=$1 WHERE id=$2";
                return [4 /*yield*/, index_1["default"].query(updateLostItemQuery, [item_found, lost_item_id])];
            case 2:
                _a.sent();
                getLostItemsQuery = "SELECT * FROM lost_items";
                return [4 /*yield*/, index_1["default"].query(getLostItemsQuery)];
            case 3:
                getLostItemsRes = _a.sent();
                response.json(getLostItemsRes.rows);
                return [3 /*break*/, 5];
            case 4:
                e_5 = _a.sent();
                console.log(e_5);
                response.status(500).json({
                    error: e_5
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
// DELETE /rooms/:id - deletes a lost item report
lostAndFoundRouter["delete"]("/:id", isLoggedIn_1["default"], function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var lost_item_id, deleteLostItemQuery, getLostItemsQuery, getLostItemsRes, e_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                lost_item_id = request.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                deleteLostItemQuery = "DELETE FROM lost_items WHERE id=$1";
                return [4 /*yield*/, index_1["default"].query(deleteLostItemQuery, [lost_item_id])];
            case 2:
                _a.sent();
                getLostItemsQuery = "SELECT * FROM lost_items";
                return [4 /*yield*/, index_1["default"].query(getLostItemsQuery)];
            case 3:
                getLostItemsRes = _a.sent();
                response.json(getLostItemsRes.rows);
                return [3 /*break*/, 5];
            case 4:
                e_6 = _a.sent();
                console.log(e_6);
                response.status(500).json({
                    error: e_6
                });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
exports["default"] = lostAndFoundRouter;
