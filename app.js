const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { auth } = require('./src/usuarios');

app.use(express.json());

module.exports = app;
