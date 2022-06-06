const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

const app = express();

app.set('view engine', 'hbs');
app.use(express.static('public'));
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

app.get('/hello/:name', (req,res)=>{
    let name = req.params.name;
    res.send('Hi ' + name);
})



app.get('/', function(req,res){
    res.render('index.hbs');
})

app.get('/admin', function(req,res){
    res.render('admin.hbs');
})

app.get('/submit-fault', function(req,res){
    res.render('submit-fault.hbs')
})

app.listen(3000, ()=>{
    console.log("Server started");
})