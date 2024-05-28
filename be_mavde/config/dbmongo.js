/*
 * Connect to the database driver (connects the service layer with the mongoose layer).
 */
var mongoose = require('mongoose');

mongoose.set('strictQuery', false);

var main = async function() {
    // url database connection
    await mongoose.connect('mongodb://localhost:27017/mavde', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

main().then((connect) => {
    console.log('MongoDB Connected');
}).catch((err) => {
    console.log(err);
});

module.exports = {
    // add model users
    User: require('../models/users'),
    // add model products
    Product: require('../models/products'),
};