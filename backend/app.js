const express   = require("express");
const bodyParser= require("body-parser");
const mongoose  = require("mongoose");
const Recipe    = require("./models/recipe")

mongoose.connect("mongodb+srv://apetugideon:yWS7JXzsFPwQLSvO@cluster0-v44vn.mongodb.net/test?retryWrites=true&w=majority")
.then(() => {
    console.log("Connection to mongoDb Atlas, successful");
})
.catch((error) => {
    console.log("could not connect");
    console.error(error);
});

const app = express();

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

app.post('/api/recipes', (request, response, next) => {
    const recipe = new Recipe({
        title: request.body.title,
        ingredients: request.body.ingredients,
        instructions: request.body.instructions,
        difficulty: request.body.difficulty,
        time: request.body.time
    });
    recipe.save()
    .then(() => {
        response.status(201).json({
            message: "Record Saved"
        });
    })
    .catch((error) => {
        response.status(400).json({
            message: "Record Not Saved"
        });
    });
});

app.get('/api/recipes', (request, response, next) => {
    Recipe.find()
    .then((recipes) => {
        response.status(200).json(recipes);
    })
    .catch((error) => {
        response.status(400).json({
            error:error
        });
    });
});

app.get('/api/recipes/:id', (request, response, next) => {
    Recipe.findOne({
        _id:request.params.id
    })
    .then((recipe) => {
        response.status(200).json(recipe);
    })
    .catch((error) => {
        response.status(404).json({
            error:error
        });
    });
});

app.put('/api/recipes/:id', (request, response, next) => {
    const recipe = new Recipe({
        title: request.body.title,
        ingredients: request.body.ingredients,
        instructions: request.body.instructions,
        difficulty: request.body.difficulty,
        time: request.body.time,
        _id:request.params.id
    });

    Recipe.updateOne({_id:request.params.id}, recipe)
    .then(() => {
        response.status(201).json({
            message:"Success"
        });
    })
    .catch((error) => {
        response.status(400).json({
            error:error
        });
    })
});


app.delete('/api/recipes/:id', (request, response, next) => {
    Recipe.deleteOne({_id: request.params.id}).then(() => {
        response.status(200).json({
            message: 'Deleted!'
        });
    }).catch ((error) => {
        response.status(400).json({
            error: error
        });
    });
});


module.exports = app;
