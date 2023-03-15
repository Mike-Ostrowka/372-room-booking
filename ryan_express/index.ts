const express = require("express");
const md5 = require("md5");
const session = require("express-session");
const cors = require("cors");
const { Pool } = require("pg");

let app = express();

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

app.use(
  session({
    name: "session",
    secret: "testsecretpleasechange",
    resave: false,
    cookie: { maxAge: 30 * 60 * 1000 },
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", function (req: any, res: any, next: any) {
  console.log(req.method, "request: ", req.url, JSON.stringify(req.body));
  next();
});

app.post("/login-api", async (request: any, response: any) => {
  let hashedpw: string = md5(request.body.password);
  let username: string = request.body.username;
  try {
    let authenticationQuery = `SELECT json_agg(a) FROM users a WHERE username = $1 AND password = $2`;
    const result = await pool.query(authenticationQuery, [username, hashedpw]);
    if (result.rows.length > 0 && result.rows[0].json_agg != null) {
      let userObject = result.rows[0].json_agg[0];
      let properObject = {
        u: userObject["username"],
        p: userObject["password"],
      };
      request.session.user = properObject;
      request.session.regenerate((err: any) => {
        if (err) {
          console.log(err);
          response.status(500).send("Error regenerating session");
        } else {
          response.json({ success: true });
        }
      });
    } else {
      console.log("Failed to login!");
      response.json({ success: false });
    }
  } catch (e) {
    console.log(e);
    response.end(e);
  }
});

function isLoggedIn(request: any, response: any, next: any) {
  let now = new Date();
  if (request.session.cookie._expires > now) {
    console.log("isLoggedIn");
    return next();
  } else {
    console.log("Not logged in.");
    response.json({ success: false });
  }
}

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
