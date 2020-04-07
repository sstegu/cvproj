const mongoose = require('mongoose');
require('dotenv').config();

module.exports.connect = async () => {
    const uri = process.env.ATLAS_URI;

    mongoose.connect(uri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    });

    const connection = mongoose.connection;

    connection.once('open', () => {
        console.log("MongoDB database connection established!");
    })

}

