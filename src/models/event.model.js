const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventModel = new Schema({
  title: {
    type: String,
    lowercase: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  text: {
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

const Event = mongoose.model('Event', EventModel);
module.exports = Event;