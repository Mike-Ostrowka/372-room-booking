// let express = require('express');
import express from 'express';
let app = express();
import path from 'path';
// let path = require('path');
// import {} from 'serve-index';
let serveIndex = require('serve-index');
import md5 from 'md5';
// let md5 = require('md5');
import {Pool} from 'pg';
import session from 'express-session'
// const {Pool} = require('pg');

class booking{
    public id:string;
    public start_time:Date;
    //length in minutes
    public length:Number;
    public room:string;
    constructor(id:string, start:Date, length:Number, room:string){
        this.id = id;
        this.start_time = start;
        this.length = length;
        this.room = room;
    }
}

let port = process.env.PORT || 8080;
let bookings:booking[] = [];

// const dbString:string = "postgres//postgres:group2@34.82.200.170/room_booking_app";

let pool = new Pool({
    host: "34.82.200.170",
    user: "testuser",
    password: "password",
    database: "room_booking_app"
});

let options:object = {
    dotfiles: 'ignore',
    extensions: ['htm', 'html', 'json']
};

app.use('/', express.static('./pub_html', options));

app.use(
    session({
        name:'session',
        secret: 'testsecretpleasechange',
        resave: false,
        cookie: {maxAge: 30*60*1000},
        saveUninitialized:true
    })
);

app.use('/', function(req:any, res:any, next:any){
    console.log(req.method, 'request: ', req.url, JSON.stringify(req.body));
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/bookings-api', (request:any, response:any) => {
    response.json(bookings);
});

app.post('/login-api', async (request:any, response:any) => {
    let hashedpw:string = md5(request.body.password);
    let username:string = request.body.username;
    try{
        let authenticationQuery = `SELECT json_agg(a) FROM authentication a WHERE username = $1 AND password = $2`;
        const result = await pool.query(authenticationQuery, [username, hashedpw]);
        // console.log(result.rows);
        if(result.rows.length > 0 && result.rows[0].json_agg != null){
            //successfully logged in!
            let userObject = result.rows[0].json_agg[0];
            let properObject = {u: userObject['username'], p: userObject['password']};
            // delete userObject['uid'];
            // console.log(properObject);
            request.session.user = properObject;
            // response.json(userObject);
            // console.log(__dirname + '/successLogin.html');
            request.session.regenerate(function(err:any) {
                response.redirect('/successLogin');
            });

            
        }else{
            console.log("Failed to login!");
            response.sendFile(__dirname + '/pub_html/failedLogin.html');
        }
    }catch (e){
        console.log(e);
        response.end(e);
    }
    

});


app.get('/success', isLoggedIn, (request:any, result:any) => {
    console.log("Logged in!");
    result.sendFile(__dirname + '/pub_html/successLogin.html');
});


function isLoggedIn (request:any, response:any, next:any){
    console.log("isLoggedIn")
    console.log(request.session.cookie._expires);
    let now = new Date();
    console.log(now)
    if(request.session.cookie._expires > now){
        return next();
    }else{
        console.log("Not logged in.");
        response.sendFile(__dirname + '/pub_html/failedLogin.html');
    }
}

app.post('/bookings-api', (request:any, response:any) => {
    console.log(request.body);
    bookings.push(request.body);
    response.json(bookings);
});

/**
 * Get all room bookings
 */
app.get('/room-booking', isLoggedIn, async (request: any, response: any) => { 
    // build and send query
    try {
        var getBookingsQuery = `SELECT * FROM room_bookings;`;
        const bookingsResult = await pool.query(getBookingsQuery);
        console.log(bookingsResult.rows);
        response.json(bookingsResult.rows);
    }
    catch (err) {
        console.log(err);
        response.end(err);
    }

})

/**
 * Add a new room booking
 * Building name, room number must exist in the db
 * Sample request body format:
 * {
 *  booking_datetime: 'YYYY-MM-DD HH:MM'
 *  duration: 120
 *  num_occupants: 2
 *  building_name: 'SUB'
 *  room_number: 2120
 *  user_id: 1
 * }
 */
app.post('/room-booking', isLoggedIn, async (request: any, response: any) => {
    // parse form data
    let booking_datetime: string = request.body.booking_datetime;
    let duration: number = request.body.duration;
    let num_occupants: number = request.body.num_occupants;
    let building_name: string = request.body.building_name;
    let room_number: number = request.body.room_number;
    let user_id: number = request.body.user_id;

    // make sure building and room exists in the rooms table
    try {
        var getRoomQuery = `SELECT * FROM rooms WHERE building_name=$1 AND room_number=$2`;
        const roomResult = await pool.query(getRoomQuery, [building_name, room_number]);
        
        if (roomResult.rowCount == 0) {
            console.log("this room does not exist in the database. please enter a valid building name and room number.");
            response.end("this room does not exist in the database. please enter a valid building name and room number.");
            return;
        }

    } catch (err) {
        console.log(err);
        response.end(err);
    }

    // build and send query
    try {
        var addBookingQuery = `INSERT INTO room_bookings (booking_datetime, duration, num_occupants, building_name, room_number, user_id) VALUES ($1, $2, $3, $4, $5, $6);`;
        const bookingResult = await pool.query(addBookingQuery, [booking_datetime, duration, num_occupants, building_name, room_number, user_id]);
        console.log(bookingResult.rows);
        response.json(bookingResult.rows);
    }
    catch (err) {
        console.log(err);
        response.end(err);
    }
});


app.listen(port, () => {
    console.log(`App running on port ${port}`);
});