const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv').config();
console.log(process.env);
const app = express();
app.set('view engine', 'hbs');
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

const MONGO_URI = process.env.MONGO_URI;

async function main() {
    const client = await MongoClient.connect(MONGO_URI, {
        'useUnifiedTopology': true 
    });

    const db = client.db('sample_airbnb')
    app.get('/test', async function(req,res){
        let data = await db.collection('listingsAndReviews').find({}).limit(10).toArray();
        res.send(data);
    })

   
}
main();

app.get('/', function(req,res){
    res.render('hello.hbs');
})

app.listen(3000, function(){
    console.log('Hello World');
})