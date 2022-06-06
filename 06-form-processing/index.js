const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on');

const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));

waxOn.on(hbs.handlebars);
waxOn.setLayoutPath('views/layouts');

app.use(express.urlencoded({
    'extended': false
}))

// 2. Routes

app.get('/',function(req,res){
    res.send('Hello World');
})

app.get('/add-food',function(req,res){
    res.render('add');
})

app.post('/add-food', function(req,res){
    console.log(req.body);
    let foodName = req.body.foodName;
    let calories = req.body.calories;
    let meal = req.body.meal;
    let tags = req.body.tags;
    tags = Array.isArray(tags) ? tags : tags ? [tags] : [];
    console.log("tags=", tags)
    res.render('result',{
        'foodName': foodName,
        'meal': meal,
        'calories': calories,
        'tags': tags
    });
})

// 3. Start Server
app.listen(3000, function(){
    console.log('Server has been started')
})