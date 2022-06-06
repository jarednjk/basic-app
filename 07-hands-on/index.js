
const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on');
const axios = require('axios');


let app = express(); //create the express application
app.set('view engine', 'hbs'); // inform express that we are using hbs as the view engine
waxOn.on(hbs.handlebars); // enable wax-on for handlebars (for template inheritance)
waxOn.setLayoutPath('./views/layouts') // inform wax-on where to find the layouts

app.use(express.urlencoded({
    'extended':false 
}))

const BASE_API_URL = 'https://ckx-movies-api.herokuapp.com/';

// routes
app.get('/', async (req, res)=>{
    let response = await axios.get(BASE_API_URL + 'movies');
    res.render('movies.hbs', {
        'movies': response.data
    })
});

app.get('/create', (req,res)=>{
    res.render('movie_form');
})

app.post('/create', async function(req,res){
    let data = {
        'title': req.body.title,
        'plot': req.body.plot,
    }
    console.log(data);
    await axios.post(BASE_API_URL + "movie/create", data);
    res.redirect('/');
})


app.listen(3000, function(){
    console.log("server started");
})