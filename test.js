const http = require('http');
const request = require('request')
const firebase = require('firebase')

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  prepareFirebase()
  


	// var itemCounter = () => {
		
	// }
  res.end('Hello World\n');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

var firebasePrepared = false

function prepareFirebase() {
  if (firebasePrepared) {
    return
  }
  var config = {
      apiKey: "AIzaSyAJn5TOjXFfIzGTHZJPiUVK5TfzGNcoLME",
      authDomain: "ourlist-dev.firebaseapp.com",
      databaseURL: "https://ourlist-dev.firebaseio.com",
      projectId: "ourlist-dev",
      storageBucket: "ourlist-dev.appspot.com",
      messagingSenderId: "746287078281"
    };
  firebase.initializeApp(config);

  firebase.auth().signInAnonymously()
      .then((user) => {
          console.log('Anonymous user logged in'); 
          countItems(null)
      })
      .catch((err) => {
          console.error('Anonymous user signin error', err);
      });

    firebasePrepared = true
}



function countItems(callback) {
  var itemNode = firebase.database().ref('items');
  itemNode.once('value')
    .then((snapshot) => {
      snapshot.forEach((item) => {
        console.log(item.val().name)
      })
  })
  
  itemNode.push( {
    project: "-Kpd_mSYHtBDzpNky9Fw",
    name: "Test124",
    done: false
  })
  
}

function addItem(item, callback) {

	request('https://ourlist-dev.firebaseio.com/items.json', 
		function(err, res, body) {
		console.log(body)
		//console.log(res)
		callback(body)
		var d = JSON.parse(body)
		console.log(d['-Kpd_o1-LUEmbSOVCBQE'].name)
	});

	// request.post({
	//   url:     'https://ourlist-dev.firebaseio.com/items.json',
	//   body:    '{ "done": false, "name": "Test3", "project": "-Kpd_mSYHtBDzpNky9Fw" }'
	// }, function(error, response, body){
	//   console.log(body);
	// });

	//curl -X POST -d '{ "done": false, "name": "Test", "project": "-Kpd_mSYHtBDzpNky9Fw" }' 'https://ourlist-dev.firebaseio.com/items.json'
}

function url() {
	return 'https://ourlist-dev.firebaseio.com/items.json'
}
