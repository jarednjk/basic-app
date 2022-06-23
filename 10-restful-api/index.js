const express = require('express');
require('dotenv').config();
const MongoUtil = require('./MongoUtil');
const MONGO_URI = process.env.MONGO_URI;
const app = express();
const cors = require('cors');
const { ObjectId } = require('mongodb');

app.use(cors());

app.use(express.json())

async function main() {
    const db = await MongoUtil.connect(MONGO_URI, "tgc18_food_sightings")
    console.log("Connected to database")
    app.get('/', function(req, res){
        res.send("hello world")
    })

    app.post('/food_sightings', async function(req,res){
        let description = req.body.description;
        let food = req.body.food;
        let datetime = req.body.datetime ? new Date(req.body.datetime) : new Date();
        let result = await db.collection('sightings').insertOne({
            'description': description,
            'food': food,
            'datetime': datetime
        })
        res.status(201);
        res.send(result);
    })

    app.get('/food_sightings', async function(req,res){
        // base query: the query that will get all the documents
        let criteria = {};
        if (req.query.description){
            criteria['description'] = {$regex: req.query.description,
            $options:"i"}
        }

        if (req.query.food) {
            criteria['food'] = {
                '$in': [req.query.food]
            }
        }

        let results = await db.collection('sightings').find(criteria).toArray();

        res.status(200);
        res.send(results);
    })

    app.put('/food_sightings/:id', async (req,res)=>{
        let description = req.body.description;
        let food = req.body.food;
        let datetime = new Date(req.body.datetime) || new Date();
        let results = await db.collection('sightings').updateOne({
            _id: ObjectId(req.params.id)
        }, {
            '$set': {
                description:description,
                food:food,
                datetime:datetime
            }
        })
        res.send(results);
    });

    app.delete('/food_sightings/:id', async(req,res)=> {
        let results = await db.collection('sightings').remove({
            _id: ObjectId(req.params.id)
        });
        res.status(200);
        res.send({
            message: 'OK'
        });
    });
}

main();

app.listen(3000, function(){
    console.log('Server has started')
})