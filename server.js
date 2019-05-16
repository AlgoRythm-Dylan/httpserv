const http = require("http"); // Or you could use HTTPS
const httpserv = require("./httpserv"); // or "./httpserv" if you downloaded the source
const server = http.createServer(httpserv.serve);
server.listen(8080);
