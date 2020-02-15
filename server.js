var express = require('express');
var bodyParser = require("body-parser");
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
   res.sendStatus(200);
})

app.post('/', function (req, res) {
    //Recieved data on the request
    //Save x-chainlink-ea-accesskey
    //Save x-chainlink-ea-secret
    console.log(req)
    console.log(req.body)
    res.sendStatus(200);
 })

app.get("/temp", function(req, res) {
    res.send({'temperature': 42})
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