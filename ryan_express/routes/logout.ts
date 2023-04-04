import { Router } from "express";
import isLoggedIn from "./middleware/isLoggedIn";

const logoutRouter = Router();

/**
 * Logs out a user by deleting their session
 * Endpoint: /logout-api
 */
logoutRouter.get("/", isLoggedIn, async (request: any, response: any) => {
  // check that session exists
  if (request.session) {
    // clear user
    request.session.user = null;
    request.session.regenerate(function (err: any) {
      if (err) {
        console.log(err);
        response.status(500).json({
          error: err,
        });
      }
      response.status(200).json({ success: "logged out" });
    });
  }
  
});

export default logoutRouter;
