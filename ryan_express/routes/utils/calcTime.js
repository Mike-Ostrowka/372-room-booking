"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Calculate and format the endtime,
// given a booking start time and duration
function calculateEndTime(start_time, duration) {
    var start = new Date(start_time);
    var end = new Date(start.getTime() + duration * 60000);
    // format end time to psql ISO date format
    var end_formatted = end.getFullYear() +
        "-" +
        (end.getMonth() + 1) +
        "-" +
        end.getDate() +
        " " +
        end.getHours() +
        ":" +
        end.getMinutes();
    return end_formatted;
}
// checks if a datetime is in the past
// called by the room review endpt to validate a review is for a past booking
function isPastDate(inputDate) {
    var inDatetime = new Date(inputDate);
    var curDatetime = new Date();
    return inDatetime < curDatetime;
}
exports.default = { calculateEndTime: calculateEndTime, isPastDate: isPastDate };
