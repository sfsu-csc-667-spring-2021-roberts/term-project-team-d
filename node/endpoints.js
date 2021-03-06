//import express
const express = require('express');

const app = express();

// Routes which should handle request

app.get("/testcard", (req, res, next) => {
    res.json([ {"red" : 3,"blue": 6,"green" : 4}]);
});

//export app
module.exports = app;