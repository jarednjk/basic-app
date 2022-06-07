const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const axios = require('axios');

const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

app.use(express.urlencoded({extended:false}));

const BASE_API_URL = 'https://ckx-restful-api.herokuapp.com/'

app.get('/', async function(req,res){
    let response = await axios.get(BASE_API_URL + 'sightings');
    console.log(response.data);
    res.render('sightings',{
        'foodSightings': response.data
    });
})

app.get('/food_sightings/create', function(req,res){
    res.render('food_form');
})

// app.get('/food_sighting/edit/:food')

app.post('/food_sighting/create', async function(req,res){
    let data = {
        'description': req.body.description,
        'food': req.body.food,
        'datetime': req.body.datetime
    }
    await axios.post(BASE_API_URL + "sighting", data);
    res.redirect('/');
})

app.get('/food_sighting/edit/:food_sighting_id', async(req,res)=>{
    let foodSightingId = req.params.food_sighting_id;
    let response = await axios.get(BASE_API_URL + 'sighting/' + foodSightingId);
    let foodSighting = response.data;
    console.log(foodSighting.datetime);
    res.render('edit_food_form', {
        'description': foodSighting.description,
        'food': foodSighting.food,
        'datetime': foodSighting.datetime.slice(0,-1)
    })
})

app.post('/food_sighting/edit/:food_sighting_id', async(req,res)=>{
    let description = req.body.description;
    let food = req.body.food.split(',');
    let datetime = req.body.datetime;
    let sightingId = req.params.food_sighting_id;

    let payload = {
        'description': description,
        'food': food,
        'datetime': datetime
    }

    let url = BASE_API_URL + 'sighting/' + sightingId;
    await axios.put(url, payload);

    res.redirect('/')
})

app.get('/food_sighting/delete/:food_sighting_id', async(req,res)=>{
    let foodSightingId = req.params.food_sighting_id;
    let response = await axios.get(BASE_API_URL + 'sighting/' + foodSightingId);
    let foodSighting = response.data;
    console.log(response.data)

    res.render('confirm_delete', {
        'food': foodSighting
    })
})

app.post('/food_sighting/delete/:food_sighting_id', async(req,res)=>{
    let foodSightingId = req.params.food_sighting_id;
    await axios.delete(BASE_API_URL + 'sighting/' + foodSightingId);
    res.redirect('/')
})

app.listen(3000,()=>{
    console.log('Server started');
})