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
const INSURALINK_ADDRESS = "0xf09931E948C261bC6bdE3bE18Ae02493bd5a0e5E"
var JOB_ID = "5e0fe1e0b89a4c7198be0fae12d84889"
var TEST_DAI = "0xBc980E67F6122F6E55fBeb9893A70c848d288B25"
//var KYBER_TEST_DAI = "0xad6d458402f60fd3bd25163575031acdce07538d"

var lastFireTime = 0
var THRESHOLD = 30
var currentContractId = 0

//Setup web3
var Web3 = require('web3');
var web3 = new Web3('wss://ropsten-rpc.linkpool.io/ws');
//On server startup pull the latest currentContractId from the contract to stay in sync
updateCurrentActiveJob()

app.get('/', function (req, res) {
   res.sendStatus(200);
})

/** Called by chainlink node when a job is created */
app.post('/', function (req, res) {
    //Recieves info from node about the job id
    //TODO store multiple job id's
    console.log(req.body)
    JOB_ID = req.body.jobId
    res.sendStatus(200);
 })

/** Called by chainlink node when running the job */ 
app.get("/temp", function(req, res) {
    res.send({'id': currentContractId})
    console.log(currentContractId)
    updateCurrentActiveJob()
});

// app.post("/temp", function(req, res) {
//     console.log(req)
//     console.log(req.body)
//     res.sendStatus(200)
// });

var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

async function updateCurrentActiveJob() {
    var insuralinkContract = new web3.eth.Contract(insuralink.abi, INSURALINK_ADDRESS)
    insuralinkContract.methods.activeCounter().call().then((result) => {
    console.log(result)
    currentContractId = result - 1
    })
}

function callChainlinkNode() {
    var url_addon = '/v2/specs/'+ JOB_ID + '/runs'
    console.log(CHAINLINK_IP+url_addon)
    request.post({
        headers: {'content-type' : 'application/json', 'X-Chainlink-EA-AccessKey': CHAINLINK_ACCESS_KEY,
        'X-Chainlink-EA-Secret': CHAINLINK_ACCESS_SECRET},
        url:     CHAINLINK_IP+url_addon,
        body:    ""
      }, function(error, response, body){
        updateCurrentActiveJob()
      });
    console.log("Job Sent")
}

//Poll sensors
// setInterval(function () {
//     request(SENSOR_IP, function (error, response, body) {
//         // console.log(error)
//         //console.log(response)
//         var data = JSON.parse(body)
//         console.log(data)
//         console.log(data.temperature)
//         console.log(data.temperature < THRESHOLD)
//         //TODO Sensor response logic
//         console.log(lastFireTime)
//         console.log(Math.round((new Date()).getTime() / 1000) - 60)
//         if (data.temperature < THRESHOLD && lastFireTime < Math.round((new Date()).getTime() / 1000) - 45) {
//             lastFireTime = Math.round((new Date()).getTime() / 1000);
//             //Call chainlink node
//             console.log("FIRING JOB")
//             console.log(data.temperature)
//             callChainlinkNode()
//         }
//     });
// }, 5000);