# httpserv
Dead simple, unbloated HTTP(s) request handler, perfect for the programmer with better things to do.

## How do I use httpserv?

- Create an `http` or `https` server using default Node.JS libs.
- Import `httpserv`
- Use `httpserv.serve` as the server request handler

```js
const http = require("http"); // Or you could use HTTPS
const httpserv = require("./httpserv");
const server = http.createServer(httpserv.serve);
server.listen(serverOptions.port);
```

## Where do I put my html files?

- Create a directory called "serve", wherever your main server file is
- That's where

*Note: other file extentions are available*

## What about handling POST and GET requests and all that jazz?

- Sure. Here's one that handles any method of request:

```js
httpserv.on("/api_endpoint", (request, response, url) => {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify(url.query));
    response.end();
});
```

- Here's one that handles only GET requests:

```js
httpserv.on("/api_endpoint", "GET", (request, response, url) => {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify(url.query));
    response.end();
});
```

- Here's one that handles both GET and POST requests:

```js
httpserv.on("/api_endpoint", ["GET", "POST"], (request, response, url) => {
    response.writeHead(200, {"Content-Type": "application/json"});
    response.write(JSON.stringify(url.query));
    response.end();
});
```

*For the curious minds, the third parameter ("url") is just the result of `url.parse(request.url, true)`,
which is convenient to have when handling your own requests. "request" and "response" are directly
from the server*

## Does it support HTTPS?

- `httpserv` doesn't care

If you have been paying attention, you will have noticed that `httpserv` doesn't actually create
a server for you, it handles the requests an already existing server might get. Therefore, you
can create either an `HTTP` or `HTTPS` server, and `httpserv` will hardly notice the difference.

## Notes

- Any request omitting an `.html` extention will be treated as an HTML request, if the exact file does not exist
- MIME types (`Content-Type`) are determined based on the extention from the request. There is a small database
included in the library with common items. If you need to modify them, just do it in the source code.
They're right near the top. Of course, this behavior is ignored with custom handlers.
- File serving is stream-based
- Files do not cache (Although, I have interest in implementing this)
- No dependencies
- Streaming audio and video should be okay, but it is untested
