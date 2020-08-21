# city_explorer_api

# City Explorer

**Author**: Jack Nelson
**Version**: 1.0.0

## Overview
<!-- Provide a high level overview of what this application is and why you are building it, beyond the fact that it's an assignment for this class. (i.e. What's your problem domain?) -->


## Getting Started
<!-- What are the steps that a user must take in order to build this app on their own machine and get it running? -->

## Architecture

A stand alone back end servicing a static front end. This server fields requests from a client and responds with data collected from various APIs.
  - Language:
    - Javascript
  - Libraries:
    - Express.js
    - Dotenv
    - Cors
    - PG
    - Superagent
  - Tools and frameworks:
    - Node.js
    - Heroku
    - PostgreSQL

## Change Log

08-17-2020 3:50pm - Packages added and server running with no routes yet defined.
08-18-2020 3:00pm - Hooked into locationIq API for location data by city search.
08-18-2020 3:40pm - Hooked into weatherbit.io API for forecast data by geo-coordinate search.
08-18-2020 5:15pm - Hooked into hikingproject.com API for trail data by geo-coordinate search.
08-19-2020 3:10pm - Created database/table to store location queries.
08-19-2020 5:45pm - Added functionality to store previous location queries and retrieve.
08-20-2020 3:10pm - Refactored server.js.
08-20-2020 4:30pm - Added /movies route and API hook.
08-20-2020 8:40pm - Added /yelp route and API hook.

## Credits and Collaborations
<!-- Give credit (and a link) to other people or resources that helped you build this application. -->

  - Many thanks to Tif Taylor for helping set up APIs and the database. You can find Tif at https://www.linkedin.com/in/tiftaylor/
  - Matthew Peterson helped refactor logical structure, check out his projects at https://github.com/Mattpet26
  - Darius Pasilaban solved issues with image paths. Connect with Darius at https://www.linkedin.com/in/pdariuslee/
  - Amelia Waggoner fixed authorization issues with the Yelp API. Check out some of her projects at https://github.com/GoldenDog190


## Progress Notes

Number and name of feature: #5 Refactor /weather route with .map()

Estimate of time needed to complete: 15m

Start time: 2:28pm

Finish time: 2:33pm

Actual time needed to complete: 5m


Number and name of feature: #6 Location route API connection

Estimate of time needed to complete: 30m

Start time: 2:45pm

Finish time: 3:00pm

Actual time needed to complete: 15m


Number and name of feature: #7 Weather route API connection

Estimate of time needed to complete: 30m

Start time: 3:15pm

Finish time: 3:40pm

Actual time needed to complete: 25m


Number and name of feature: #8 Implement Trail route and API connection

Estimate of time needed to complete: 45m

Start time: 3:50pm

Finish time: 5:15pm

Actual time needed to complete: 85m


Number and name of feature: #9 Setup Database

Estimate of time needed to complete: 30m

Start time: 2:10pm

Finish time: 3:10pm

Actual time needed to complete: 60m


Number and name of feature: #10 Server Code Workflow

Estimate of time needed to complete: 1hr

Start time: 3:10pm

Finish time: 5:45pm

Actual time needed to complete: 2hr 35m


Number and name of feature: #11 Deploy

Estimate of time needed to complete: 30m

Start time: 5:45pm

Finish time: 6:04pm

Actual time needed to complete: 20m


Number and name of feature: #12 Add Movie Route

Estimate of time needed to complete: 90m

Start time: 3:10pm

Finish time: 4:30pm

Actual time needed to complete: 80m

Number and name of feature: #13 Add Yelp Route

Estimate of time needed to complete: 90m

Start time: 5:00pm

Finish time: 8:40pm

Actual time needed to complete: 120m

Number and name of feature: ________________________________

Estimate of time needed to complete: _____

Start time: _____

Finish time: _____

Actual time needed to complete: _____

Number and name of feature: ________________________________

Estimate of time needed to complete: _____

Start time: _____

Finish time: _____

Actual time needed to complete: _____







