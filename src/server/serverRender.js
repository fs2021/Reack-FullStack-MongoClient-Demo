//this file is for fetch data from api to provide seach engines with information about site
import React from "react";
import express from "express";
import axios from "axios";
import ReactDOMServer from "react-dom/server";
import App from '../components/app';

import config from '../../config';
//let tmpUrl = 'http://localhost:8080'

const getApiUrl = (contestId) => {
    if(contestId){
        return `${config.serverUrl}/api/contests/${contestId}`;
    }
    return `${config.serverUrl}/api/contests`;
};

const getInitialData = (contestId, apiData) => {
    if(contestId){
        return {
            currentContestId: apiData._id,
            contests: {
                [apiData._id]: apiData,
            }
        }
    }
    return {
        contests: apiData.contests
    }
};

const serverRender = (contestId) => 
    axios.get(getApiUrl(contestId))
    .then((resp) => {
        console.log(resp.data);
        const initialData = getInitialData(contestId, resp.data);
        return {
            initialMarkup: ReactDOMServer.renderToString(<App initialData={initialData} />),
            initialData: initialData,
        };
    })
    .catch(console.error);
    


export default serverRender;

