
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const casesArray = new Schema({
    date: { type: Date, required: true },
    number: { type: Number, required: true }
});

const caseSchema = new Schema({
    country: { type: String, required: true },
    region: { type: String },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    cases: [casesArray]
}, {
    timestamps: true
});

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;