import config from "../../config";
import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import bodyParser from 'body-parser';
import apiRouter from '../../api';

import App from "../components/app";

const sassMiddleware = require('node-sass-middleware');
const path = require('path');
let rootPath = path.join(__dirname, '../../');
console.log(rootPath);



const server = express();
server.set('view engine', 'ejs');

import serverRender from './serverRender';

server.use(bodyParser.json());

server.use(sassMiddleware({
  /* Options */
  src: path.join(rootPath, 'sass'),
  dest: path.join(rootPath, 'dist'),
  debug: true,
  outputStyle: 'compressed',
  //prefix:  '/prefix'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));
// Note: you must place sass-middleware *before* `express.static` or else it will
// not work.

server.get(['/', '/contest/:contestId'], (req, res) => {
  console.log(req.params.contestId);
  serverRender(req.params.contestId)
    .then(( {initialMarkup, initialData} ) => {
      res.render('index', {initialMarkup, initialData});
    })
    .catch(error => {
      console.error(error);
      res.status(404).send('error');
    });

  //res.render('index', {content:'...'});
});


server.use('/api', apiRouter);

server.use(express.static("dist"));





// server.get("/", (req, res) => {
//   const initialMarkup = ReactDOMServer.renderToString(<App />);

//   res.send(`
//     <html>
//       <head>
//         <title>Sample React App</title>
//       </head>
//       <body>
//         <div id="mountNode">${initialMarkup}</div>
//         <script src="/main.js"></script>
//       </body>
//     </html>
//   `)
// });





server.listen(config.port, config.host, () => console.log("Server is running...", config.port));
