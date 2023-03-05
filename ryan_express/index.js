"use strict";
var express = require('express');
var app = express();
var path = require('path');
var serveIndex = require('serve-index');
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
var options = {
    dotfiles: 'ignore',
    extensions: ['htm', 'html', 'json']
};
app.use('/', express.static('./pub_html', options));
app.use('/', function (req, res, next) {
    console.log(req.method, 'request: ', req.url, JSON.stringify(req.body));
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/bookings-api', function (request, response) {
    response.json(bookings);
});
app.post('/bookings-api', function (request, response) {
    console.log(request.body);
    bookings.push(request.body);
    response.json(bookings);
});
app.listen(port, function () {
    console.log("App running on port ".concat(port));
});
