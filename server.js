var express = require('express');
var app = express();

app.get('/', function (req, res) {
   res.sendStatus(200);
})

app.get("/temp", function(req, res) {
    res.send({'temperature': 42})
});

app.post("/temp", function(req, res) {
    console.log(req.body)
    res.sendStatus(200)
});

var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });