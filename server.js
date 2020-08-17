'use strict';

// --- Packages ---

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const { json } = require('express');


// --- Global Variables ---

const PORT = process.env.PORT || 3003; // default PORT 3003 if .env spec fails
const app = express();
app.use(cors());


// --- Routes ---

app.get('/location', (req, res) => {
  const jsonData = require('./data/location.json');
  const builtLocation = new Location(jsonData);

  response.send(builtLocation);
})


// --- Functions ---

function Location(jsonData) {
  // this.search_query = jsonData.query;
  this.formatted_query = jsonData[0].display_name;
  this.latitude = jsonData[0].lat;
  this.longitude = jsonData[0].lon;
}

// [
//   {
//     "place_id": "222943963",
//     "licence": "https://locationiq.com/attribution",
//     "osm_type": "relation",
//     "osm_id": "237662",
//     "boundingbox": [
//       "47.802219",
//       "47.853569",
//       "-122.34211",
//       "-122.261618"
//     ],
//     "lat": "47.8278656",
//     "lon": "-122.3053932",
//     "display_name": "Lynnwood, Snohomish County, Washington, USA",
//     "class": "place",
//     "type": "city",
//     "importance": 0.61729106268039,
//     "icon": "https://locationiq.org/static/images/mapicons/poi_place_city.p.20.png"
//   }
// ]

// {
//   "search_query": "seattle",
//   "formatted_query": "Seattle, WA, USA",
//   "latitude": "47.606210",
//   "longitude": "-122.332071"
// }































// --- Server Start ---

app.listen(PORT, () => console.log(`server running on PORT : ${PORT}`));




