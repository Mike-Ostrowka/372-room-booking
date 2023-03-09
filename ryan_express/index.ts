let express = require('express');
let app = express();
let path = require('path');
let serveIndex = require('serve-index');
let md5 = require('md5');
const {Pool} = require('pg');

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

const dbString:string = "postgres//postgres:group2@34.82.200.170/room_booking_app";

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
    console.log(hashedpw);
    try{
        let authenticationQuery = `SELECT (username, password) FROM authentication WHERE username = $1 AND password = $2`;
        const result = await pool.query(authenticationQuery, [username, hashedpw]);
        console.log(result.rows);
        if(result.rows.length > 0){
            response.json({success: true});
        }else{
            response.json({success: false});
        }
    }catch (e){
        console.log(e);
        response.end(e);
    }

});

app.post('/bookings-api', (request:any, response:any) => {
    console.log(request.body);
    bookings.push(request.body);
    response.json(bookings);
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});