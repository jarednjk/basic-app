
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
    console.log(response.data);
    res.render('movies.hbs', {
        'movies': response.data
    })
});

app.get('/movie/create', (req,res)=>{
    res.render('movie_form');
})

app.post('/movie/create', async function(req,res){
    await axios.post(BASE_API_URL + "movie/create", {
        'title': req.body.title,
        'plot': req.body.plot,
    });
    res.redirect('/');
})

app.get('/edit/movie/:movie_id', async(req, res)=>{
    let movieId = req.params.movie_id;
    let response = await axios.get(BASE_API_URL + "movie/" + movieId);
    let movie = response.data;
    console.log(movie.title);

    res.render('edit_movie_form',{
        'title': movie.title,
        'plot': movie.plot
    })
})

app.post('/edit/movie/:movie_id', async(req, res)=>{
    let title = req.body.title;
    let plot = req.body.plot;
    let movieId = req.params.movie_id;

    let payload = {
        'title': title,
        'plot': plot
    }
    let url = BASE_API_URL + 'movie/' + movieId;
    await axios.patch(url, payload);

    res.redirect('/')
})

app.get('/delete/movie/:movie_id', async(req,res)=>{
    let response = await axios.get(BASE_API_URL + 'movie/' + req.params.movie_id);
    let movie = response.data;
    console.log(response.data);

    res.render('delete_movie.hbs',{
        'movie': movie
    })
})

app.post('/delete/movie/:movie_id', async(req,res)=>{
    await axios.delete(BASE_API_URL + 'movie/' + req.params.movie_id);
    res.redirect('/');
})


app.listen(3000, function(){
    console.log("server started");
})