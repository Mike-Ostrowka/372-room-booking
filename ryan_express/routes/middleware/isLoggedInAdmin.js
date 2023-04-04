"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Middleware to check if the user is logged in
function isLoggedInAdmin(request, response, next) {
    if (request.session.user && request.session.user.is_staff) {
        console.log("isLoggedIn as staff");
        return next();
    }
    else {
        console.log("Not logged in.");
        response.json({ success: false });
    }
}
exports.default = isLoggedInAdmin;
