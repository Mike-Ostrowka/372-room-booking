"use strict";
exports.__esModule = true;
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
exports["default"] = calculateEndTime;
