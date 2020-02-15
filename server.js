var express = require('express');
var bodyParser = require("body-parser");
var request = require("request")
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const SENSOR_IP = "http://10.0.0.210"
const CHAINLINK_IP = "http://35.226.187.4:6688"
const CHAINLINK_ACCESS_KEY = "934de8d11ba04776983c88c08dcc4391"
const CHAINLINK_ACCESS_SECRET = "0U8n49W8a3nFUChxZvKNDXrCAY2Ltec4cG2kNmMY0AUMxUdvlPGOr1c2W/W3mAnD"
//var requestID = "27088baff0bf4e0b8653e2ac3b1c77c4"
var requestID = "116e2b0c02e049a3ae4208ad48ba1aae"
var lastTemp = 0
var THRESHOLD = 30

app.get('/', function (req, res) {
   res.sendStatus(200);
})

app.post('/', function (req, res) {
    //Recieves info from node about the job id
    console.log(req.body)
    requestID = req.body.jobId
    res.sendStatus(200);
 })

app.get("/temp", function(req, res) {
    res.send({'temperature': lastTemp})
});

app.post("/temp", function(req, res) {
    console.log(req)
    console.log(req.body)
    res.sendStatus(200)
});

var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });

function callChainlinkNode() {
    var url_addon = '/v2/specs/'+ requestID + '/runs'
    console.log(CHAINLINK_IP+url_addon)
    request.post({
        headers: {'content-type' : 'application/json', 'X-Chainlink-EA-AccessKey': CHAINLINK_ACCESS_KEY,
        'X-Chainlink-EA-Secret': CHAINLINK_ACCESS_SECRET},
        url:     CHAINLINK_IP+url_addon,
        body:    ""
      }, function(error, response, body){
        //console.log(error)
        //console.log(response)
        console.log(body);
      });
    console.log("Job Sent")
}

setInterval(function () {
    // request(SENSOR_IP, function (error, response, body) {
    //     // console.log(error)
    //     //console.log(response)
    //     console.log(body)
    // });

    // var temp = 34 - Math.floor(Math.random() * Math.floor(5));

    // // //TODO Sensor response logic
    // if (temp < THRESHOLD) {
    //     //Call chainlink node
    //     console.log(temp)
    //     callChainlinkNode()
    // }

    callChainlinkNode()
}, 20000);