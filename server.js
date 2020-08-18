'use strict';

// --- Packages ---

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const superagent = require('superagent');
const { response } = require('express');


// --- Global Variables ---

const PORT = process.env.PORT || 3003; // default PORT 3003 if .env spec fails
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const app = express();
app.use(cors());


// --- Routes ---

app.get('/location', (req, res) => {
  // const jsonData = require('./data/location.json');
  const cityQuery = req.query.city;
  const urlToSearch = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${cityQuery}&format=json`;

  superagent.get(urlToSearch)
    .then(resFromSuperagent => {
      const jsonData = resFromSuperagent.body;
      const builtLocation = new Location(jsonData, cityQuery);
    
      res.send(builtLocation);
    })
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




