import http from 'http';
import fs from 'fs';

import { addTask } from './sqlmanager.js';
import { clearTasks } from './sqlmanager.js';
import { constructTaskView } from './sqlmanager.js';

http.createServer(function (req, res) {
  var input = req.url.substring(1);
  var decoded = decodeURI(input);
  var inputArray = decoded.split('/');

  if (input == "") {
    fs.readFile("index.html", function (err, data){
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }
  else if (input == "app.js" || input == "db.js") {
    // Close
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<script>window.close();</script>");
    res.end();
  }
  else if (inputArray[0] == "addTask") {
    // Close redirect
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<script>window.close();</script>");
    res.end();
    
    var taskName = inputArray[1];
    addTask(taskName);
  }
  else if (inputArray[0] == "clearTasks") {
    // Close redirect
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<script>window.close();</script>");
    res.end();

    clearTasks();
  }
  else if (inputArray[0] == "taskview.html") {
    (async () => {
      var taskview = await constructTaskView();

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(taskview);
      res.end();
    })();
  }
  else if (input.includes('.html')) {
    fs.readFile(input, function (err, data){
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }
  else if (input.includes('.js')) {
    fs.readFile(input, function (err, data){
      res.writeHead(200, {'Content-Type': 'application/javascript'});
      res.write(data);
      res.end();
    });
  }
  else if (input.includes('.css')) {
    fs.readFile(input, function (err, data){
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.write(data);
      res.end();
    });
  }
  else {
    // Close
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write("<script>window.close();</script>");
    res.end();
  }
}).listen(8000);

console.log("App is running: http://localhost:8000/");