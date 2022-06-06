const express = require('express');

// create an express application
let app = express();

// add routes
// a route is a url on our server. first argument: path of url. 2nd argument:
app.get('/', function(req, res){
    res.send('Hello World');
})

app.get('/about-us', function(req, res){
    res.send('<h1>About Us</h1><p>About our company</p>');
})

app.get('/hello/:name', function(){
    res.send("Hi," + req.params.name);
})

app.get('/calculate', function(req,res){
    let a = req.query.a;
    let b = req.query.b;
})
// first arg: port number
app.listen(3000, function(){
    console.log('server started')
})