const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/JeloDB', { useNewUrlParser: true });
const db = mongoose.connection;

module.exports = db;
