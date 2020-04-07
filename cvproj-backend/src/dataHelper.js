const csvtojson = require('csvtojson');
const moment = require('moment');
let Case = require('../models/case.model');


require('dotenv').config();

const FILE_PATH = process.env.FILE_PATH;

module.exports.insertCases = async function (path) {
    console.debug("default file path" + FILE_PATH);
    let fPath = path || FILE_PATH;
    console.debug("insert file path: " + fPath);
    await csvtojson()
        .fromFile(FILE_PATH)
        .subscribe((json) => {
            //console.log(json);
            return new Promise((resolve, reject) => {
                let region = json['Province/State'];
                let country = json['Country/Region'];
                let lat = json['Lat'];
                let lng = json['Long'];
                let cases = this.createCaseArray(json, moment('1/1/20'), moment());
                
                if (country.length > 0) {
                    let newCase = new Case({
                        country,
                        region,
                        lat,
                        lng,
                        cases
                    });

                    newCase.save().then(() => {
                        resolve("inserted");
                    });

                } else {
                    reject("not inserted: " + json);
                }
            });

        }, (err) => console.log(err));
}

module.exports.createCaseArray = function (caseData, start, end) {

    let cases = [];

    while (start.isSameOrBefore(end)) {

        let caseDte = start.format('M/D/YY');

        if (caseData[caseDte] !== undefined) {
            let numCases = caseData[caseDte];
            cases.push({ 'date': caseDte, 'number': numCases });
        }
        start.add(1, 'days');
    }
    return cases;
};
