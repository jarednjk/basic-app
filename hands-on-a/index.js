const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');

const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public'));

wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

app.use(express.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    res.send('Hello World');
})

app.get('/calc-bmi',(req,res)=>{
    res.render('calc-bmi');
})

app.post('/calc-bmi',(req,res)=>{
    console.log(req.body)
    let weight = Number(req.body.weight);
    let height = Number(req.body.height);
    let bmi = weight / height ** 2;
    res.render('result',{
        'bmi': bmi
    })
})

app.listen(3000, ()=>{
    console.log("Server started")
})