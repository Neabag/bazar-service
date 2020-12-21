var canned = require("canned");
var http = require("http");
var opts = { logger: process.stdout };

var can = canned("./server", opts);
var port = process.env.PORT || 3005;

http.createServer(can).listen(port);
