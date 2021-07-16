
const axios = require("axios");
const Table = require("tty-table");
const chalk = require("chalk");
const inquirer = require('inquirer');
const notifier = require("node-notifier");

const { config, options } = require("./config")
const message = chalk.keyword('green');
const highlight = chalk.keyword('orange');
const error = chalk.keyword('red')

module.exports = function (districtID) {

    let header = [
        {
            value: "center",
            alias: "Center",
            headerColor: "yellow",
            color: "white",
            color: "cyan",
            align: "left",
            width: 40
        },
        {
            value: "address",
            alias: "Address",
            headerColor: "yellow",
            color: "white",
            color: "cyan",
            align: "left",
            width: 80
        },
        {
            value: "available",
            alias: "Available",
            headerColor: "yellow",
            color: "white",
            color: "cyan",
            align: "left",
            width: 20
        },
        {
            value: "age",
            alias: "Age Limit",
            headerColor: "yellow",
            color: "white",
            color: "cyan",
            align: "left",
            width: 20
        }, {
            value: "date",
            alias: "Date",
            headerColor: "yellow",
            color: "white",
            color: "cyan",
            align: "left",
            width: 20
        },
    ]

    var date = new Date();
    var todaysDate = `${date.getDate()}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;


    inquirer
        .prompt([
            /* Pass your questions in here */
            {
                type: "list",
                name: "choices",
                message: "Please choose an age group",
                choices: [
                    {
                        name: "All ages",
                        value: "",
                    },
                    {
                        name: "45+",
                        value: "45",
                    },
                    {
                        name: "18+",
                        value: "18",
                    },
                ]
            }

        ])
        .then((answers) => {
            // Use user feedback for... whatever!!
            console.log(answers);
            axios
                .get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtID}&date=${todaysDate}`, config)
                .then(function (response) {
                    // handle success
                    // console.log(response.data);
                    const centers = response.data.centers;
                    var dataArray = [];
                    var districtName = centers[0].district_name;
                    var stateName = centers[0].state_name;
                    var totalAvailableSlots = 0;

                    centers.forEach(center => {
                        center.sessions.forEach(session => {
                            if (answers.choices == "" || answers.choices == session.min_age_limit) { //to choose data according to the age , "" for al ages
                                let available;
                                if (session.available_capacity != 0) {
                                    available = session.available_capacity;
                                    totalAvailableSlots += available ;
                                } else {
                                    available = error("X");
                                }
                                let data = {
                                    center: center.name,
                                    address: center.address,
                                    available: available,
                                    age: session.min_age_limit,
                                    date: session.date
                                };
                                dataArray.push(data);
                            }
                        })
                    })

                    const result = Table(header, dataArray, options).render();

                    console.log(message(`Date for which run -> ${todaysDate}`));
                    console.log(message(`District -> ${districtName}`));
                    console.log(message(`State -> ${stateName}`));
                    if (dataArray.length != 0) {
                        console.log(result);
                    } else {
                        console.log("\n" + highlight("No Data Found") + "\n");
                    }

                    //send desktop notification
                    if (totalAvailableSlots > 0) {
                        notifier.notify({
                            title: "Cowin slots executed",
                            subtitle: "subtitle",
                            message: `Found ${totalAvailableSlots} available Cowin slots`,
                            wait: true,
                        })
                    }


                })
                .catch(function (err) {
                    // handle error
                    console.log(error(err));
                });
        })
        .catch((error) => {
            if (error.isTtyError) {
                // Prompt couldn't be rendered in the current environment
                console.log(error(err));
            } else {
                // Something else went wrong
                console.log(error(err));
            }
        });
};