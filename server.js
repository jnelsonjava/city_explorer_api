'use strict';

// --- Packages ---

const express = require('express');
require('dotenv').config();
const cors = require('cors');


// --- Global Variables ---

const PORT = process.env.PORT || 3003; // default PORT 3003 if .env spec fails
const app = express();
app.use(cors());


// --- Server Start ---

app.listen(PORT, () => console.log(`server running on PORT : ${PORT}`));




