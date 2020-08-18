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
  const builtLocation = new Location(jsonData, req.query.city);

  res.send(builtLocation);
})

app.get('/weather', (req, res) => {
  const jsonData = require('./data/weather.json');
  const weatherArr = [];
  jsonData.data.forEach(forecast => {
    weatherArr.push(new Weather(forecast));
  })

  res.send(weatherArr);
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




