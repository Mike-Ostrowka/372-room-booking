"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Middleware to check if the user is logged in
function isLoggedIn(request, response, next) {
    if (request.session.user) {
        console.log("isLoggedIn");
        return next();
    }
    else {
        console.log("Not logged in.");
        response.json({ success: false });
    }
}
exports.default = isLoggedIn;
