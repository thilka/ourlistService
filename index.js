/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

'use strict';

const Alexa = require('alexa-sdk');
var request = require('request');
var firebase = require('firebase');

const APP_ID = 'amzn1.ask.skill.cfb76dd2-a3c2-4805-b0a4-3a01c31ebce8';

const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', 'Was müssen wir einkaufen?', 'Was müssen wir einkaufen?');
    },
    'AddItem': function () {

        const itemString = buildItem(
            this.event.request.intent.slots.itemOne.value, 
            this.event.request.intent.slots.itemTwo.value)
        
        if (itemString) {       
            addItem(itemString, (result) => {
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
    prepareAlexa(event, context, callback)
};

function buildItem(itemPartOne, itemPartTwo) {
    if (!itemPartOne) {
        return undefined
    }
    var item = itemPartOne
    if (itemPartTwo) {
        item = itemPartOne + ' ' + itemPartTwo
    }
    return item
}

function prepareFirebase() {
    console.log('Preparing firebase ...')
    var config = {
        apiKey: "AIzaSyAJn5TOjXFfIzGTHZJPiUVK5TfzGNcoLME",
        authDomain: "ourlist-dev.firebaseapp.com",
        databaseURL: "https://ourlist-dev.firebaseio.com",
        projectId: "ourlist-dev",
        storageBucket: "ourlist-dev.appspot.com",
        messagingSenderId: "746287078281"
      };
    firebase.initializeApp(config);
    console.log('Preparing firebase done!')

    firebase.auth().signInAnonymously()
        .then((user) => {
            console.log('Anonymous user logged in.'); 
        })
        .catch((err) => {
            console.error('Anonymous user signin error', err);
        });
}

function prepareAlexa(event, context, callback) {
    console.log('Preparing Alexa ...')
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
    console.log('Preparing Alexa done!')
}

function addItem(item, callback1) {
    // var itemNode = firebase.database().ref('items');
    // itemNode.push( {
    //     project: "-Kpd_mSYHtBDzpNky9Fw",
    //     name: item,
    //     done: false
    //   }, function(error){
    //     console.log(error);
    //     callback1(item)
    //   });

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
