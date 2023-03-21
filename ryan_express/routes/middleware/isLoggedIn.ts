// Middleware to check if the user is logged in
function isLoggedIn(request: any, response: any, next: any) {
    if (request.session.user) {
      console.log("isLoggedIn");
      return next();
    } else {
      console.log("Not logged in.");
      response.json({ success: false });
    }
}

export default isLoggedIn;