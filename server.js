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
const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const YELP_API_KEY = process.env.YELP_API_KEY;
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
app.get('/movies', getMovies);
app.get('/yelp', getYelp);


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

function getMovies(req, res) {

  const movieApiUrl = `https://api.themoviedb.org/3/search/movie?api_key=${MOVIE_API_KEY}&language=en-US&query=${req.query.search_query}&page=1&include_adult=false`;


  superagent.get(movieApiUrl)
    .then(movieApiResult => {
      res.send(movieApiResult.body.results.map(movie => new Movie(movie)));
    })
    .catch(error => {
      console.log(error);
      res.status(500).send(error.message);
    });
}

function getYelp(req, res) {
  console.log(req.query);
  const limit = 20;
  const term = 'restaurant';
  const offset = limit * req.query.page - limit;

  const yelpQuery = `https://api.yelp.com/v3/businesses/search?latitude=${req.query.latitude}&longitude=${req.query.longitude}&limit=${limit}&term=${term}&offset=${offset}`;

  superagent.get(yelpQuery)
    .set('Authorization', `Bearer ${YELP_API_KEY}`)
    .then(yelpResponse => {
      res.send(yelpResponse.body.businesses.map(restaurant => new Yelp(restaurant)));
    })
    .catch(error => {
      console.log(error);
      res.status(500).send(error.message);
    });

  // res.send([
  //   {
  //     "name": "Pike Place Chowder",
  //     "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/ijju-wYoRAxWjHPTCxyQGQ/o.jpg",
  //     "price": "$$   ",
  //     "rating": "4.5",
  //     "url": "https://www.yelp.com/biz/pike-place-chowder-seattle?adjust_creative=uK0rfzqjBmWNj6-d3ujNVA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=uK0rfzqjBmWNj6-d3ujNVA"
  //   },
  //   {
  //     "name": "Umi Sake House",
  //     "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/c-XwgpadB530bjPUAL7oFw/o.jpg",
  //     "price": "$$   ",
  //     "rating": "4.0",
  //     "url": "https://www.yelp.com/biz/umi-sake-house-seattle?adjust_creative=uK0rfzqjBmWNj6-d3ujNVA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=uK0rfzqjBmWNj6-d3ujNVA"
  //   }
  // ])
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

function Movie(movieObj) {
  this.title = movieObj.title;
  this.overview = movieObj.overview;
  this.average_votes = movieObj.vote_average;
  this.total_votes = movieObj.vote_count;
  this.image_url = 'https://image.tmdb.org/t/p/w600_and_h900_bestv2/' + movieObj.poster_path;
  this.popularity = movieObj.popularity;
  this.released_on = movieObj.release_date;
}

function Yelp(yelpObj) {
  this.name = yelpObj.name;
  this.image_url = yelpObj.image_url;
  this.price = yelpObj.price;
  this.rating = yelpObj.rating;
  this.url = yelpObj.url;
}

// {
//   id: '6I28wDuMBR5WLMqfKxaoeg',
//   alias: 'pike-place-chowder-seattle',
//   name: 'Pike Place Chowder',
//   image_url: 'https://s3-media1.fl.yelpcdn.com/bphoto/ZyQjV-wJQ2GHyX7l3jfbyg/o.jpg',
//   is_closed: false,
//   url: 'https://www.yelp.com/biz/pike-place-chowder-seattle?adjust_creative=5fnHnfOzM-sMwBOk--Xvfg&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=5fnHnfOzM-sMwBOk--Xvfg',
//   review_count: 7356,
//   categories: [ [Object], [Object] ],
//   rating: 4.5,
//   coordinates: { latitude: 47.60939, longitude: -122.34112 },
//   transactions: [ 'pickup', 'delivery' ],
//   price: '$$',
//   location: {
//     address1: '1530 Post Aly',
//     address2: 'Ste 11',
//     address3: '',
//     city: 'Seattle',
//     zip_code: '98101',
//     country: 'US',
//     state: 'WA',
//     display_address: [Array]
//   },
//   phone: '+12062672537',
//   display_phone: '(206) 267-2537',
//   distance: 1832.5436169291488
// }

// {
//   "name": "Pike Place Chowder",
//   "image_url": "https://s3-media3.fl.yelpcdn.com/bphoto/ijju-wYoRAxWjHPTCxyQGQ/o.jpg",
//   "price": "$$   ",
//   "rating": "4.5",
//   "url": "https://www.yelp.com/biz/pike-place-chowder-seattle?adjust_creative=uK0rfzqjBmWNj6-d3ujNVA&utm_campaign=yelp_api_v3&utm_medium=api_v3_business_search&utm_source=uK0rfzqjBmWNj6-d3ujNVA"
// }


// --- Server Start ---

client.connect()
  .then(() => {
    app.listen(PORT, () => console.log(`server running on PORT : ${PORT}`));
  });




