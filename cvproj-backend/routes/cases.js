const csvToJson = require('csvtojson');
const moment = require('moment');
const router = require('express').Router();
let cases = require('../models/case.model');


require('dotenv').config();

const FILE_PATH = process.env.FILE_PATH;

router.route('/countries').get(async (req, res) => {
    try {
        const result = await cases.distinct('country').sort();
        return res.json(result);
    } catch (err) {
        return res.status(400).json('error', err);
    };
});

router.route('/:country').get(async (req, res) => {
    try {
        const result = await cases.find({ country: req.params.country }, (err, result) => {
            return res.json(result);
        });

    }
    catch (err) {
        return res.status(400).json('error: ' + err);
    }
});

router.route('/mb/:country/:dateFilter').get(async (req, res) => {
    try {
        let features = [];
        let dateFilter = moment(req.params.dateFilter).startOf('day');

        await cases.find({ country: req.params.country }, (err, result) => {
            //console.log(result);
            result.forEach((elem, index) => {

                let id = elem['country'] + elem['region'];

                let caseByDate = elem.cases.find((elem) => moment(elem.date, 'M/D/YY').isSame(dateFilter));

                if (caseByDate !== undefined) {
                    features.push({
                        "type": "Feature", "properties": { "id": id, "cases": caseByDate.number },
                        "geometry": { "type": "Point", "coordinates": [elem['lng'], elem['lat']] }
                    });
                }
            });

            return res.json({
                "type": "FeatureCollection",
                "crs": { "type": "name", "properties": { "name": "my features" } },
                "features": features
            });

        });


    } catch (err) {
        return res.status(400).json('error: ' + err);
    }
});

async function timeSeriesToJSON(country) {
    console.log(FILE_PATH);
    const jsonObj = await csvToJson().fromFile(FILE_PATH);
    return jsonObj.filter((elem) => {
        let country_region = elem['Country_Region'] || elem['Country/Region'];
        return country_region === country;
    });

}



function convertCsvToJson() {
    let cases = [];
    fs.recurse(FILE_PATH, ['*.csv'], (filepath, relative, filename) => {

        csvToJson().fromFile(filepath).then((jsonObj) => {
            let caCases = jsonObj.filter((elem) => {
                let country_region = elem['Country_Region'] || elem['Country/Region'];
                let prov = elem['Province/State'] || elem['Province_State'];
                //console.log(country_region);
                return (country_region === 'Canada' || country_region === 'CA') && prov === 'Ontario';
            });

            cases = [...cases, ...caCases];

            cases.forEach((val) => {
                console.log(val);
            });
        });

    });

}

module.exports = router;