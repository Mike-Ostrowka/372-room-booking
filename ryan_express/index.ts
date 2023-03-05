let express = require('express');
let app = express();
let path = require('path');
let serveIndex = require('serve-index');

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

let options:object = {
    dotfiles: 'ignore',
    extensions: ['htm', 'html', 'json']
};

app.use('/', express.static('/pub_html', options));
app.use('/', function(req:any, res:any, next:any){
    console.log(req.method, 'request: ', req.url, JSON.stringify(req.body));
    next();
});

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get('/bookings-api', (request:any, response:any) => {
    response.json(bookings);
});

app.post('/bookings-api', (request:any, response:any) => {
    console.log(request.body);
    bookings.push(request.body);
});

app.listen(port, () => {
    console.log(`App running on port ${port}`);
});