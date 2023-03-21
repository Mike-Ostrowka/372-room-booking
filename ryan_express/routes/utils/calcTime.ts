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

export default calculateEndTime;