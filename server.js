'use strict';

// --- Packages ---

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');


// --- Global Variables ---

const PORT = process.env.PORT || 3003; // default PORT 3003 if .env spec fails
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const TRAIL_API_KEY = process.env.TRAIL_API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
const app = express();


// --- Express Configs ---

app.use(cors());
const client = new pg.Client(DATABASE_URL);
client.on('error', (error) => console.error(error));


// --- Routes ---

app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/trails', getTrails);


// --- Route Handlers ---

function getLocation(req, res) {
  const cityQuery = req.query.city;

  client.query(`SELECT * FROM locations WHERE search_query = '${cityQuery}'`)
    .then(resultFromSql => {
      if (resultFromSql.rowCount) {
        console.log(`found city: ${cityQuery} ... responding with DB location`);
        res.send(resultFromSql.rows[0]);
      } else {
        console.log(`city <${cityQuery}> not found in DB`);
        const urlToSearch = `https://us1.locationiq.com/v1/search.php?key=${GEOCODE_API_KEY}&q=${cityQuery}&format=json`;

        superagent.get(urlToSearch)
          .then(resFromSuperagent => {
            
            console.log('retrieved location from API, sending to client and caching in DB');
            const jsonData = resFromSuperagent.body;
            res.send(new Location(jsonData, cityQuery));
      
            const insertQuery = `INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ($1, $2, $3, $4)`;
            const valueArray = [cityQuery, jsonData[0].display_name, jsonData[0].lat, jsonData[0].lon];

            client.query(insertQuery, valueArray);
          })
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).send(error.message);
    });
}

function getWeather(req, res) {
  const lat = req.query.latitude;
  const lon = req.query.longitude;
  const urlToSearch = `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${lat}&lon=${lon}&key=${WEATHER_API_KEY}`;

  superagent.get(urlToSearch)
    .then(resFromSuperagent => {
      const jsonData = resFromSuperagent.body;
      res.send(jsonData.data.map(forecast => new Weather(forecast)));
    })
    .catch(error => {
      console.log(error);
      res.status(500).send(error.message);
    });
}

function getTrails(req, res) {
  const lat = req.query.latitude;
  const lon = req.query.longitude;
  const urlToSearch = `https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=10&key=${TRAIL_API_KEY}`;

  superagent.get(urlToSearch)
    .then(resFromSuperagent => {
      const jsonTrailDataArray = resFromSuperagent.body.trails;
      res.send(jsonTrailDataArray.map(trailData => new Trail(trailData)));
    })
    .catch(error => {
      console.log(error);
      res.status(500).send(error.message);
    });
}


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


// --- Server Start ---

client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`server running on PORT : ${PORT}`));
  });




