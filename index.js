/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Alexa = require('alexa-sdk');
var request = require('request');


const APP_ID = 'amzn1.ask.skill.cfb76dd2-a3c2-4805-b0a4-3a01c31ebce8';

const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', 'Was müssen wir einkaufen?', 'Was müssen wir einkaufen?');
    },
    'AddItem': function () {
        const item1 = this.event.request.intent.slots.itemOne.value
        var item = item1
        if (item1) {
            const item2 = this.event.request.intent.slots.itemTwo.value
            if (item2) {
                item = item1 + ' ' + item2
            }

            addItem(item, (result) => {
                this.emit(':ask', result, 'Noch was?');                
                this.context.done();
            });
        } else {
            this.emit(':ask', 'Ich habe nichts hinzugefügt');
        }
    },
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', 'Was müssen wir einkaufen?', 'Was müssen wir einkaufen?');
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Auf Wiedersehen!');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Schönen Einkauf!');
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};


function addItem(item, callback1) {

    // TODO: enable proper authentication!!!!
    // need to switch authentication of in firebase in order to make it work!
    request.post({
      url:     'https://ourlist-dev.firebaseio.com/items.json',
      body:    '{ "done": false, "name": "' + item + '", "project": "-Kpd_mSYHtBDzpNky9Fw" }'
    }, function(error, response, body){
      console.log(body);
      callback1(item)
    });

    //curl -X POST -d '{ "done": false, "name": "Test", "project": "-Kpd_mSYHtBDzpNky9Fw" }' 'https://ourlist-dev.firebaseio.com/items.json'
}
