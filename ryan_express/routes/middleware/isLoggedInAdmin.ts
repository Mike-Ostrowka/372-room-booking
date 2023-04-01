// Middleware to check if the user is logged in
function isLoggedInAdmin(request: any, response: any, next: any) {
  if (request.session.user && request.session.user.is_staff) {
    console.log("isLoggedIn as staff");
    return next();
  } else {
    console.log("Not logged in.");
    response.json({ success: false });
  }
}

export default isLoggedInAdmin;
