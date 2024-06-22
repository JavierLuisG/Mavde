// import mongoose
var mongoose = require("mongoose");

/**
 * database schema for products
 */
var schema = new mongoose.Schema({
    sku_code: { type: String, unique: true, required: true },
    name: { type: String, unique: true, required: true },
    //image: { data: Buffer, contentType: String },
    gender_type: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    color: { type: String, required: true },
    brand: { type: String, required: true },
    size: { type: String, required: true },
    status: { type: Boolean, required: false}
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
module.exports = mongoose.model('Product', schema);