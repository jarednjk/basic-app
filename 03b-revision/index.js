const express = require('express');

const hbs = require('hbs');

const app = express();

app.set('view engine', 'hbs')

app.use(express.static('public'));

app.get('/', function(req, res){
    res.render('index');
})

app.get('/hello/:name', function(req, res){
    let name = req.params.name;
    res.render('hello', {
        'name': name
    });
})

app.listen(3000, function(){
    console.log('Server started')
})