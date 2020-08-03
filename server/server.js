require('./config/config');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());


app.use(require('./routes/usuario'));

mongoose.connect(process.env.urlDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, (err, res) => {
    if (err) throw err;
    console.log('BASE DATOS ONLINE');
});

app.listen(process.env.PORT, function() {
    console.log('Corriendo en el puerto:', process.env.PORT);
});