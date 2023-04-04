import { Router } from "express";
import md5 from "md5";
import pool from "../index";

const registerRouter = Router();

// POST /register-api - registers new users into the system
registerRouter.post("/", async (request: any, response: any) => {
  let firstName: string = request.body.firstName;
  let lastName: string = request.body.lastName;
  let username: string = request.body.username;
  let password: string = md5(request.body.password);
  let isStaff: boolean = request.body.isStaff;

  if (await isUser(username)) {
    console.log("user already exists");
    response.json({ success: false, userExists: true });
    return;
  }
  try {
    // creating a new user in users table
    let registerQuery = `INSERT INTO users (username, password, firstname, lastname, isstaff) VALUES ($1, $2, $3, $4, $5)`;
    console.log(registerQuery);
    const result = await pool.query(registerQuery, [
      username,
      password,
      firstName,
      lastName,
      isStaff,
    ]);
    // check if user was registered successfully
    if (result.rowCount == 1) {
      console.log("registered user");
      response.json({ success: true, userExists: false });
    } else {
      console.log("failed to register user");
      response.json({ success: false, userExists: false });
    }
  } catch (e) {
    console.log(e);
    response.end(e);
  }
});

// check if user exists
async function isUser(username: string) {
  try {
    let authenticationQuery = `SELECT json_agg(a) FROM users a WHERE username = $1`;
    const result = await pool.query(authenticationQuery, [username]);
    if (result.rows.length > 0 && result.rows[0].json_agg != null) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    console.log(e);
  }
}

export default registerRouter;
