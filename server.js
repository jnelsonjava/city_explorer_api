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
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const TRAIL_API_KEY = process.env.TRAIL_API_KEY;
const app = express();
app.use(cors());


// --- Routes ---

app.get('/location', (req, res) => {
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
  const lat = req.query.latitude;
  const lon = req.query.longitude;
  const urlToSearch = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}`;

  superagent.get(urlToSearch)
    .then(resFromSuperagent => {
      const jsonData = resFromSuperagent.body;
      res.send(jsonData.data.map(forecast => new Weather(forecast)));
    })
})

app.get('/trails', (req, res) => {
  const lat = req.query.latitude;
  const lon = req.query.longitude;
  const urlToSearch = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=${TRAIL_API_KEY}`;

  superagent.get(urlToSearch)
    .then(resFromSuperagent => {
      // throw new Error('stuff is broke y\'all');
      const jsonTrailDataArray = resFromSuperagent.body.trails;
      res.send(jsonTrailDataArray.map(trailData => new Trail(trailData)));
    })
    // .catch(errorHandler)
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

function Trail(trailObj) {
  this.name = trailObj.name;
  this.location = trailObj.location;
  this.length = trailObj.length;
  this.stars = trailObj.stars;
  this.star_votes = trailObj.starVotes;
  this.summary = trailObj.summary;
  this.trail_url = trailObj.url;
  this.conditions = `${trailObj.conditionStatus}: ${trailObj.conditionDetails}`;
  this.condition_date = trailObj.conditionDate.split(' ')[0];
  this.condition_time = trailObj.conditionDate.split(' ')[1];
}

// function errorHandler(error) {
//   response.status(500).send(error.message);
// }


// --- Server Start ---

app.listen(PORT, () => console.log(`server running on PORT : ${PORT}`));




