const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

let app = express(); //create express application
app.set('view engine', 'hbs'); // inform express that we are using hbs as view engine
app.use(express.static('public'));

wax.on(hbs.handlebars); // enable wax-on for handlebars for template inheritance
wax.setLayoutPath('./views/layouts'); // inform wax-on where to find the layouts

app.use(express.urlencoded({extended:false})); // for processing html forms because html forms are quite simple

app.get('/',(req,res)=>{
    res.send('hello jared');
})

app.get('/total-cost', (req,res)=>{
    res.render('total-cost');
})

app.post('/total-cost', (req,res)=>{
    res.send(req.body);
    let fruits = [];
    // if req.body.items is already an array, no further processing
    if (Array.isArray(req.body.items)) {
        fruits = req.body.items;
    } else {
        if (req.body.items) {
            fruits = [req.body.items]
        } else {
            fruits = [];
        }
    }
    // if req.body.items is a single item then convert it to an array consisting of just that item

    // if req.body.items is undefined (or otherwise falsely) then the result is an empty array
    let total = 0;
    for (let eachFruit of fruits) {
        if (eachFruit == 'apple') {
            total += 3;
        }
        if (eachFruit == 'durian') {
            total += 15;
        }
        if (eachFruit == 'orange') {
            total += 6;
        }
        if (eachFruit == 'banana') {
            total += 4;
        }
    }


    res.send(fruits);
})

app.listen(8000, ()=>{
    console.log("Server started")
})