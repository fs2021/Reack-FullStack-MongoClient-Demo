# Reack-FullStack-MongoClient-Demo
Updated 2022, fixed issues with deprecated methods

github:
jscomplete/learn-fullstack-javascript

npm init
npm install express
npm i mongodb
npm i react react-dom
npm i -D webpack webpack-cli
old: npm i -D babel-loader @babel/cli @babel/core @babel/preset-env @babel/preset-react @babel/plugin-proposal-class-properties
npm i babel-loader @babel/core @babel/node @babel/preset-env @babel/preset-react
npm i -D nodemon
old: npm i -D eslint babel-eslint eslint-plugin-react
npm i -D eslint babel-eslint eslint-plugin-react eslint-plugin-react-hooks
npm i -D jest babel-jest react-test-renderer
npm i prop-types
----------------
to install exact packages fron package.json, run : 
npm i
for specific version:
npm i modulename@1.0.3
--------------

we need "@babel/cli": "^7.17.6", for deploy
"@babel/node": "^7.x", for development. Add this to .json and run npm i 

create dir: src/index.js, public/index.html, api/index.js
package.json/scripts: 
    "start": "nodemon --exec babel-node server.js",
    "dev": "webpack -wd",

create file webpack.config.js, enter all config
(Run Webpack with --mode=production in production. )


create file babel.config.js, .eslintrc.js
-----config is on jscomplete.com/reactful
-------------------
import PropTypes from 'prop-types' 
--------------------
./filename   -- is on the same level
../filename  -- is up 1 level

to run file:
./node_modules\.bin\babel-node ./src/server/server.js

------------
npm run dev:server
npm run dev:bundler
--------------
 http://localhost:4242/

 npm i -S ejs
 DO NOT install!:   npm i -S json-loader, add it to webpack.config.js

 npm install node-sass-middleware

 npm install axios
---to run .js file from console, when we add loadTestData.js to mongodb
 npm install -g babel-cli

 npm i body-parser
