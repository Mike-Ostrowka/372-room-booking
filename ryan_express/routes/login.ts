import { Router } from "express";
import md5 from "md5";
import pool from "../index";

const loginRouter = Router();

loginRouter.post("/", async (request: any, response: any) => {
    let hashedpw: string = md5(request.body.password);
    let username: string = request.body.username;
    try {
      let authenticationQuery = `SELECT json_agg(a) FROM users a WHERE username = $1 AND password = $2`;
      const result = await pool.query(authenticationQuery, [username, hashedpw]);
      if (result.rows.length > 0 && result.rows[0].json_agg != null) {
        let userObject = result.rows[0].json_agg[0];
        let properObject = {
          u_id: userObject["user_id"],
          u: userObject["username"],
          p: userObject["password"],
          success: true,
        };
        request.session.regenerate((err: any) => {
          if (err) {
            console.log(err);
            response.status(500).send("Error regenerating session");
          } else {
            request.session.user = properObject;
            response.json(properObject);
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

export default loginRouter;