
const axios = require("axios");
const Table = require("tty-table");

const { config, options } = require("./config")

module.exports = function () {

    let header = [{
        value: "state_id",
        alias: "State ID",
        headerColor: "yellow",
        color: "white",
        align: "left",
        width: 20
    },
    {
        value: "state_name",
        alias: "State Name",
        headerColor: "yellow",
        color: "white",
        color: "cyan",
        align: "left",
        width: 40
    }]

    axios
        .get("https://cdn-api.co-vin.in/api/v2/admin/location/states", config)
        .then(function (response) {
            // handle success
            // console.table(response.data.states);
            const states = response.data.states;
            const result = Table(header, states, options).render();
            console.log(result);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
};