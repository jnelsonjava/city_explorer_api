'use strict';

// --- Packages ---

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { response } = require('express');


// --- Global Variables ---

const PORT = process.env.PORT || 3003; // default PORT 3003 if .env spec fails
const app = express();
app.use(cors());


// --- Routes ---

app.get('/location', (req, res) => {
  const jsonData = require('./data/location.json');

  if (req.query.city !== 'lynnwood') {
    // reference for a method of returning error messages
    // https://stackoverflow.com/questions/35864088/how-to-send-error-http-response-in-express-node-js
    return res.status(500).send({
      'status' : 500,
      'responseText' : 'Sorry, something went wrong'
    })
  } else {
    const builtLocation = new Location(jsonData, req.query.city);
  
    res.send(builtLocation);
  }

})

app.get('/weather', (req, res) => {
  const jsonData = require('./data/weather.json');

  res.send(jsonData.data.map(forecast => new Weather(forecast)));
})


// --- Functions ---

function Location(jsonData, query) {
  this.search_query = query;
  this.formatted_query = jsonData[0].display_name;
  this.latitude = jsonData[0].lat;
  this.longitude = jsonData[0].lon;
}

function Weather(forecastObj) {
  this.forecast = forecastObj.weather.description;
  this.time = forecastObj.valid_date;
}


// --- Server Start ---

app.listen(PORT, () => console.log(`server running on PORT : ${PORT}`));




