import React from "react";
import ReactDOM from "react-dom/client";
import axios from 'axios';
import App from "./components/app";
//import testData from './test2data';
//let testData = require('./testData');
//console.log(testData);


const container = document.getElementById("root");

// Create a root.
const root = ReactDOM.createRoot(container);
// Initial 

root.render(<App initialData={window.initialData} />);

// axios.get('/api/contests')
//         .then(resp => {
//           //console.log(resp.data.contests)
//           root.render(<App initialContests={resp.data.contests} />);
//           this.setState({
//             contests: resp.data.contests
//           });
//         })
        
//         .catch(console.error);




// During an update, there is no need to pass the container again
//root.render(<App name="Saeloun testimonials" />);

// setTimeout(() => {
//     root.render(<h2>deleted</h2>)
// }, 4000);