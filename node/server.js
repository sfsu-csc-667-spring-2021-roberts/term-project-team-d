var http = require("http");  // require module

//import app.js file
const app = require('./app');

  http.createServer(app).listen(7777, () =>{ 
    console.log('Server running at http://localhost:7777/')}); //{  
     // Send the HTTP header   
       // HTTP Status: 200 : OK  
       // Content Type: text/plain  
      //  response.writeHead(200, {'Content-Type': 'text/plain'});   
      //  response.end('Hello World\n');  
  // }).listen(7777);  
    // Console will print the message  

