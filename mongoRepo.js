const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const counterSchema = new Schema({
  title: String,
  count: Number,
});

const mongoRepository = mongoose.model('Counter', counterSchema);

module.exports = mongoRepository;
