const dotenv = require("dotenv").config();
const { RTMClient } = require('@slack/client');
const axios = require('axios');
const money = require('money');

const token = process.env.SLACK_TOKEN;
const rtm = new RTMClient(token);

money.base = "EUR";

rtm.start();

rtm.on('message', (event) => {
    console.log(`(channel:${event.channel}) ${event.user} says: ${event.text}`);
    const fixerToken = process.env.FIXER_TOKEN;
    axios.get(`http://data.fixer.io/api/latest?access_key=${fixerToken}&symbols=GBP`)
        .then(res => {
            money.rates = res.data.rates;
            convertedMoney = (money.convert(event.text, {
                from: "EUR",
                to: "GBP"
            }));
            rtm.sendMessage(`${convertedMoney} £`, event.channel)
                .then((res) => {
                    console.log('Message sent: ', res.ts);
                })
                .catch(console.error);
        })
});