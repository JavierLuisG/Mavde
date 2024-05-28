// import mongoose
var mongoose = require("mongoose");

/**
 * database schema for users
 */
var schema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: Boolean, required: false },
  password: { type: String, required: true },
});

/**
 * use this set item for convert _id to id
 * 
 * @method delete converted._id - remove the _id generated so that only the id is displayed
 */
schema.set('toJSON', {
  virtuals: true,
  transform: (doc, converted) => {
    delete converted._id;
  }
});

// export the schema
module.exports = mongoose.model('User', schema);