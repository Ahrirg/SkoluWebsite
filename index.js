const express = require('express');
const cors = require('cors')
const fs = require('fs');
const path = require('path');
const app = express();

const Port = 6969;

app.use(cors());

app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")));


app.get('/', (req, res) => {
    res.render('Main');
})

app.listen(Port, function() {
    console.log(`Server running on port: ${Port}.`);
})