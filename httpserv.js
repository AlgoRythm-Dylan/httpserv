// Stream-based KISS HTTP(S) server

const url = require("url");
const pathlib = require("path")
const fs = require("fs");

// A small database of MIME associations
var MIMES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".ico": "image/x-icon",
    ".bmp": "image/bmp",
    ".pdf": "application/pdf",
    ".7z": "application/x-7z-compressed",
    ".avi": "video/x-msvideo",
    ".sh": "application/x-sh",
    ".bz": "application/x-bzip",
    ".bz2": "application/x-bzip2",
    ".c": "text/x-c",
    ".gif": "image/gif",
    ".jar": "application/java-archive",
    ".class": "application/java-vm",
    ".java": "text/x-java-source",
    ".json": "application/json",
    ".exe": "application/x-msdownload",
    ".mp4": "video/mp4",
    ".mp4a": "audio/mp4",
    ".wav": "audio/x-wav",
    ".xml": "application/xml",
    ".zip": "application/zip"
}

var servePath = "serve/";
function doStream(request, response, filePath, stats, MIME){
    let responseOptions = {};
    let streamOptions = {};
    let responseCode = 200;
    if(MIME){
        responseOptions["Content-Type"] = MIME;
    }
    let range = request.headers.range;
    if(range){
        let parts = range.replace(/bytes=/,"").split("-");
        let start = parseInt(parts[0], 10);
        let end = parts[1] ? parseInt(parts1, 10) : stats.size - 1;
        let chunkSize = (end - start) + 1;
        streamOptions = {start, end};
        responseOptions["Content-Range"] = `btyes ${start}-${end}/${stats.size}`;
        responseOptions["Accept-Ranges"] = "bytes";
        responseOptions["Content-Length"] = chunkSize;
        responseCode = 206; // Partial data
    }
    response.writeHead(responseCode, responseOptions);
    fs.createReadStream(filePath, streamOptions).pipe(response);
}

var handlers = {};

module.exports.on = function(path, requestType, handler){
    if(typeof requestType == "function"){
        handler = requestType;
        requestType = null;
    }
    else if(typeof requestType == "string")
        requestType = [requestType];
    handlers[path] = {
        handler: handler,
        requestTypes: requestType
    };
}

module.exports.serve = function(request, response){
    let parsedURL = url.parse(request.url, true); // .query
    let path = parsedURL.pathname;
    if(path === "/") path = "/index.html";
    let fileType = null;
    var MIME = null;
    if(path.indexOf(".") != -1){
        fileType = path.substr(path.lastIndexOf(".")).toLowerCase();
        MIME = MIMES[fileType];
    }
    // Serve the actual file
    var filePath = pathlib.join(servePath, path);
    if(filePath.indexOf(servePath) !== 0){
        response.end();
        return;
    }
    let handler = handlers[path];
    if(handler !== undefined){
        if(handler.requestTypes === null || handler.requestTypes.indexOf(request.method) != -1){
            handler.handler(request, response, parsedURL);
            return;
        }
    }
    fs.stat(filePath, function(error, stats){
        if(error){
            // Whoopsie. See if they just omitted the .html
            fs.stat(filePath + ".html", function(error, stats){
                if(error){
                    response.writeHead(404);
                    response.write("Item not found");
                    response.end();
                    totalFailure = true;
                }
                else{
                    filePath = filePath + ".html";
                    doStream(request, response, filePath, stats, MIMES[".html"]);
                }
            });
        }
        else{
            doStream(request, response, filePath, stats, MIME);
        }
    });
}

module.exports.setServePath = function(newPath){
    servePath = newPath;
}
