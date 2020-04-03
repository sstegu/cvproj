const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const casesRouter = require('./routes/cases');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

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

app.use(cors(corsOptions));
app.use(express.json());

app.use('/cases', casesRouter);

app.on('listening', () => {
  console.log('server listening ***');
});


app.listen(port, () => {

  console.log('server running on port: ' + port);

});