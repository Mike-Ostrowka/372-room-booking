// Calculate and format the endtime,
// given a booking start time and duration
function calculateEndTime(start_time: string, duration: number) {
    let start = new Date(start_time);
    let end = new Date(start.getTime() + duration * 60000);
  
    // format end time to psql ISO date format
    let end_formatted =
      end.getFullYear() +
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
function isPastDate(inputDate: string) {
  let inDatetime = new Date(inputDate);
  let curDatetime = new Date();
  return inDatetime < curDatetime;
}

// checks if a datetime is in the future
// called by the cancel booking endpt
function isFutureDate(inputDate: string) {
  let inDatetime = new Date(inputDate);
  let curDatetime = new Date();
  return inDatetime > curDatetime;
}

export default {calculateEndTime, isPastDate, isFutureDate};