const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const MongoUtil = require('./MongoUtil');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const helpers = require('handlebars-helpers')({
    handlebars: hbs.handlebars
});

let app = express(); //create the express application
app.set('view engine', 'hbs'); // inform express that we are using hbs as the view engine
wax.on(hbs.handlebars); // enable wax-on for handlebars (for template inheritance)
wax.setLayoutPath('./views/layouts') // inform wax-on where to find the layouts

const MONGO_URI = process.env.MONGO_URI;

app.use(express.urlencoded({
    'extended': false // for processing HTML forms usually it's false because
    // HTML forms are usually quite simple
}))

async function main() {
    const db = await MongoUtil.connect(MONGO_URI, 'tgc18_pets');
    app.get('/', async function (req, res) {
        let allPetRecords = await db.collection('pet_records').find({}).toArray();
        res.render('all-pets.hbs', {
            'allPets': allPetRecords
        })
    })
    // routes
    app.get('/add-pets', function (req, res) {
        res.render('add-pets.hbs')
    })

    app.post('/add-pets', async function (req, res) {
        let petName = req.body.petName;
        let breed = req.body.breed;
        let description = req.body.description;
        let age = req.body.age;
        let problems = req.body.problems.split(',');
        let hdbApproved = req.body.hdbApproved;
        let tags = [];
        if (Array.isArray(req.body.tags)) {
            tags = req.body.tags;
        } else if (req.body.tags) {
            tags = [req.body.tags];
        }

        let petDocument = {
            'name': petName,
            'breed': breed,
            'description': description,
            'age': age,
            'problems': problems,
            'hdbApproved': hdbApproved,
            'tags': tags
        }

        await db.collection('pet_records').insertOne(petDocument);
        res.redirect("/");
    })

    app.get('/update/:id', async function(req,res){
        let id = req.params.id;
        let petRecord = await db.collection('pet_records').findOne({
            '_id': ObjectId(id)
        });
        res.render('update-pet', {
            petRecord
        })

    })

    app.post('/update/:id', async function(req,res){
        let id = req.params.id;
        let petName = req.body.petName;
        let breed = req.body.breed;
        let description = req.body.description;
        let age = req.body.age;
        let problems = req.body.problems.split(',');
        let hdbApproved = req.body.hdbApproved == 'true';
        let tags = [];
        if (Array.isArray(req.body.tags)) {
            tags = req.body.tags;
        } else if (req.body.tags) {
            tags = [req.body.tags];
        }
        let updatedPetRecord = {
            'name': petName,
            'breed': breed,
            'description': description,
            'age': age,
            'problems': problems,
            'hdbApproved': hdbApproved,
            'tags': tags
        }
        await db.collection('pet_records').updateOne({
            '_id': ObjectId(id)
        }, {
            '$set': updatedPetRecord
        })
        res.redirect('/');
    })

    app.get('/delete/:id', async function(req,res){
        let id = req.params.id;
        let petRecord = await db.collection('pet_records').findOne({
            '_id': ObjectId(id)
        });
        res.render('delete-pet', {
            petRecord
        })
    })

    app.post('/delete/:id', async function(req,res){
        let id = req.params.id;
        await db.collection('pet_records').deleteOne({
            '_id': ObjectId(id)
        })
        res.redirect('/')
    })
}

main();

app.listen(3000, function () {
    console.log("server started");
})