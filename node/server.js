    var http = require("http");  // require module
    http.createServer(function (request, response) {  
     // Send the HTTP header   
       // HTTP Status: 200 : OK  
       // Content Type: text/plain  
       response.writeHead(200, {'Content-Type': 'text/plain'});   
       response.end('Hello World\n');  
    }).listen(7777);  
    // Console will print the message  
    console.log('Server running at http://localhost:7777/');  
