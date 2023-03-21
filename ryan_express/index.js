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
var express_1 = __importDefault(require("express"));
var md5_1 = __importDefault(require("md5"));
var express_session_1 = __importDefault(require("express-session"));
var cors_1 = __importDefault(require("cors"));
var pg_1 = __importDefault(require("pg"));
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
                password = (0, md5_1["default"])(request.body.password);
                isStaff = request.body.isStaff;
                return [4 /*yield*/, isUser(username)];
            case 1:
                if (_a.sent()) {
                    console.log("user already exists");
                    response.json({ success: false, userExists: true });
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
                    response.json({ success: true, userExists: false });
                }
                else {
                    console.log("failed to register user");
                    response.json({ success: false, userExists: false });
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
                    properObject_1 = {
                        u_id: userObject["user_id"],
                        u: userObject["username"],
                        p: userObject["password"],
                        success: true
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
// Search for available rooms
app.use('/search-rooms', searchRooms_1["default"]);
// Room bookings
app.use('/room-booking', roomBooking_1["default"]);
app.listen(port, function () {
    console.log("App running on port ".concat(port));
});
exports["default"] = pool;
