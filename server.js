var express = require('express');
var bodyParser = require("body-parser");
var request = require("request")
var app = express();
var insuralink = require('./insuralink.json')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Consts
const SENSOR_IP = "http://10.0.1.13"
const CHAINLINK_IP = "http://35.226.187.4:6688"
const CHAINLINK_ACCESS_KEY = "934de8d11ba04776983c88c08dcc4391"
const CHAINLINK_ACCESS_SECRET = "0U8n49W8a3nFUChxZvKNDXrCAY2Ltec4cG2kNmMY0AUMxUdvlPGOr1c2W/W3mAnD"
const INSURALINK_ADDRESS = "0x08e8de6956b869b2C656c4742f6Af12fCeB91e9d"
//var requestID = "27088baff0bf4e0b8653e2ac3b1c77c4"
var requestID = "0202447b75984769b517927f43da4bb5"
var lastTemp = 0
var lastFireTime = 0
var THRESHOLD = 30
var currentContractId = 0

//Setup web3
//On server startup pull the latest currentContractId from the contract to stay in sync
var Web3 = require('web3');
var web3 = new Web3('wss://ropsten-rpc.linkpool.io/ws');
// var insuralinkContract = new web3.eth.Contract(insuralink.abi, INSURALINK_ADDRESS)
// insuralinkContract.methods.activeCounter().call().then((result) => {
//     console.log(result)
//     currentContractId = result
// })

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
    res.send({'id': currentContractId})
    currentContractId++;
    console.log(currentContractId)
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
    request(SENSOR_IP, function (error, response, body) {
        // console.log(error)
        //console.log(response)
        var data = JSON.parse(body)
        console.log(data)
        console.log(data.temperature)
        console.log(data.temperature > THRESHOLD)
        //TODO Sensor response logic
        if (data.temperature > THRESHOLD && lastFireTime < Math.round((new Date()).getTime() / 1000) - 60) {
            lastFireTime = Math.round((new Date()).getTime() / 1000);
            //Call chainlink node
            console.log("FIRING JOB")
            console.log(body.temperature)
            callChainlinkNode()
        }
    });
}, 5000);