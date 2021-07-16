
const axios = require("axios");
const Table = require("tty-table");

const { config, options } = require("./config")

module.exports = function (stateID) {

    let header = [{
        value: "district_id",
        alias: "District ID",
        headerColor: "yellow",
        color: "white",
        align: "left",
        width: 20
    },
    {
        value: "district_name",
        alias: "District Name",
        headerColor: "yellow",
        color: "white",
        color: "cyan",
        align: "left",
        width: 40
    }]

    // Make a request for a user with a given ID
    axios
        .get(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateID}`, config)
        .then(function (response) {
            // handle success
            // console.table(response.data.states);
            const districts = response.data.districts;
            const result = Table(header, districts, options).render();
            console.log(result);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
};