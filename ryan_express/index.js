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
// let express = require('express');
var express_1 = __importDefault(require("express"));
var app = (0, express_1["default"])();
// let path = require('path');
// import {} from 'serve-index';
var serveIndex = require('serve-index');
var md5_1 = __importDefault(require("md5"));
// let md5 = require('md5');
var pg_1 = require("pg");
var express_session_1 = __importDefault(require("express-session"));
// const {Pool} = require('pg');
var booking = /** @class */ (function () {
    function booking(id, start, length, room) {
        this.id = id;
        this.start_time = start;
        this.length = length;
        this.room = room;
    }
    return booking;
}());
var port = process.env.PORT || 8080;
var bookings = [];
// const dbString:string = "postgres//postgres:group2@34.82.200.170/room_booking_app";
var pool = new pg_1.Pool({
    host: "34.82.200.170",
    user: "testuser",
    password: "password",
    database: "room_booking_app"
});
var options = {
    dotfiles: 'ignore',
    extensions: ['htm', 'html', 'json']
};
app.use('/', express_1["default"].static('./pub_html', options));
app.use((0, express_session_1["default"])({
    name: 'session',
    secret: 'testsecretpleasechange',
    resave: false,
    cookie: { maxAge: 30 * 60 * 1000 },
    saveUninitialized: true
}));
app.use('/', function (req, res, next) {
    console.log(req.method, 'request: ', req.url, JSON.stringify(req.body));
    next();
});
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: false }));
app.get('/bookings-api', function (request, response) {
    response.json(bookings);
});
app.post('/login-api', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var hashedpw, username, authenticationQuery, result, userObject, properObject, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                hashedpw = (0, md5_1["default"])(request.body.password);
                username = request.body.username;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                authenticationQuery = "SELECT json_agg(a) FROM authentication a WHERE username = $1 AND password = $2";
                return [4 /*yield*/, pool.query(authenticationQuery, [username, hashedpw])];
            case 2:
                result = _a.sent();
                // console.log(result.rows);
                if (result.rows.length > 0 && result.rows[0].json_agg != null) {
                    userObject = result.rows[0].json_agg[0];
                    properObject = { u: userObject['username'], p: userObject['password'] };
                    // delete userObject['uid'];
                    // console.log(properObject);
                    request.session.user = properObject;
                    // response.json(userObject);
                    // console.log(__dirname + '/successLogin.html');
                    request.session.regenerate(function (err) {
                        response.redirect('/successLogin');
                    });
                }
                else {
                    console.log("Failed to login!");
                    response.sendFile(__dirname + '/pub_html/failedLogin.html');
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
app.get('/success', isLoggedIn, function (request, result) {
    console.log("Logged in!");
    result.sendFile(__dirname + '/pub_html/successLogin.html');
});
function isLoggedIn(request, response, next) {
    console.log("isLoggedIn");
    console.log(request.session.cookie._expires);
    var now = new Date();
    console.log(now);
    if (request.session.cookie._expires > now) {
        return next();
    }
    else {
        console.log("Not logged in.");
        response.sendFile(__dirname + '/pub_html/failedLogin.html');
    }
}
app.post('/bookings-api', function (request, response) {
    console.log(request.body);
    bookings.push(request.body);
    response.json(bookings);
});
app.listen(port, function () {
    console.log("App running on port ".concat(port));
});
