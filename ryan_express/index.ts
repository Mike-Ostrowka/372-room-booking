const express = require("express");
const md5 = require("md5");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

let port = process.env.PORT || 8080;

let pool = new Pool({
  host: "34.82.200.170",
  user: "testuser",
  password: "password",
  database: "room_booking_app",
});

app.post("/login-api", async (request: any, response: any) => {
  let hashedpw: string = md5(request.body.password);
  let username: string = request.body.username;
  try {
    let authenticationQuery = `SELECT username, password FROM authentication WHERE username = $1 AND password = $2`;
    const result = await pool.query(authenticationQuery, [username, hashedpw]);
    if (result.rows.length > 0) {
      response.json({ success: true });
    } else {
      response.json({ success: false });
    }
  } catch (e) {
    console.log(e);
    response.end();
  }
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
