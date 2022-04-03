import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import assert from 'assert';
import config from '../config';



var dbo; //db object
//var MongoClient = require('mongodb').MongoClient;
MongoClient.connect(config.mongodbUri, function(err, db) {
    if (err) throw err;
    dbo = db.db(config.mongodbName);    
    });


const router = express.Router();

//add test data to db, use Postman 
// router.get('/dbAddTest', (req, res) => {

//       MongoClient.connect(config.mongodbUri, function(err, client){
//         assert.equal(null,err);
//         var db = client.db('reactTutorial');
//        // mdb = db;
    
//         db.collection('contests').insertMany([
//             { id: 1, categoryName: 'Business/Company', contestName: 'Cognitive Building Bricks',
//             description: `
//         This product is a classroom tool that scaffolds higher order thinking. Its a collaborative strategy that using building bricks to help structure students ideas. Learners build knowledge structures with information (attached to different coloured bricks). Students desks are turned into workshops where they physically manipulate information into meaningful creations. They show sequences of information (like stories), rank information by importance and pretty much all other essential cognitive skills you need at school. The end result is clarity in thought and better collaborative conversations. I want this to be marketed as a sophisticated knowledge tool applicable to all ages and subjects. It gives students the cognitive edge, they get a little more 'RAM'!.
        
//         I want to continue with the construction/building theme as well as the mind/brain/learning theme. They need to be blended somehow. Teachers find it easier to talk about building/scaffolding analogies as its less abstract.
//             `,
//             nameIds: [101, 102] },
//             { id: 2, categoryName: 'Magazine/Newsletter', contestName: 'Educating people about sustainable food production',
//             description: `
//         Educating people about sustainable food production
//             `,
//             nameIds: [] },
//             { id: 3, categoryName: 'Software Component', contestName: 'Big Data Analytics for Cash Circulation',
//             description: `
//         Data is created at every touch point in a notes life-cycle. Because of the volume of the data, it can be difficult to store, analyse and gain insight. Collecting, processing and analysing the data using big data technologies and displaying the results in an interactive display makes it easy to make informative decisions, overcome problem and plan for the future.
        
//         It works using big data technologies and displays the results in modern browsers, combining powerful visualisation components and a data-driven approach to interact with the data.
        
//         It enables you to analyse data that were not previously possible. The volume, variety, complexity of the analytical processing involved, and the responsiveness required are now achievable with the product. Gaining smarter decision making but also provide faster time to value.
//             `,
//             nameIds: [103, 104, 105] },
//             { id: 4, categoryName: 'Website', contestName: 'Free programming books',
//             description: `
//         A list of free online programming books, categorized by languages/topics
//             `,
//             nameIds: [] }
//         ]).then(response => {
//             console.info('Contests', response.insertedCount);
//             db.collection('names').insertMany([
//             { id: 101, name: 'Mind Assembly', timestamp: new Date() },
//             { id: 102, name: 'Brain Scaffold', timestamp: new Date() },
//             { id: 103, name: 'Cash View', timestamp: new Date() },
//             { id: 104, name: 'Currency Map', timestamp: new Date() },
//             { id: 105, name: 'Cash Board', timestamp: new Date() },
//             { id: 106, name: 'RootLib', timestamp: new Date() },
//             ]).then(response => {
//             console.info('Names', response.insertedCount);
//             client.close();
//             });
//         });
//     });
    
    
// });


// let testData = require('../src/testData');
// //make objects from list
// const contests = testData.contests.reduce((obj, contest) => {
//     obj[contest.id] = contest;
//     return obj;
// }, {});

router.get('/contests', (req, res) => {
    let contests = {};
    
    dbo.collection("contests").find({}, 
        { projection: { _id: 1, categoryName: 1, contestName: 1 } })
        .toArray(function(err, result) {
        if (err) throw err;
        //console.log(result);
        result.forEach(contest => { contests[contest._id] = contest });
        //db.close();
        res.send({contests});
    });
}); 

  
router.get('/names/:nameIds', (req, res) => {
let names = {};
const nameIds = req.params.nameIds.split(',').map(ObjectId);
// var MongoClient = require('mongodb').MongoClient;
// MongoClient.connect(config.mongodbUri, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db(config.mongodbName);
    dbo.collection("names").find({ _id: { $in: nameIds }}).toArray(function(err, result) {
        if (err) throw err;
        //console.log(result);
        result.forEach(eachname => { names[eachname._id] = eachname });
        //db.close();
        res.send({names});
    });
    }); 
       

router.get('/contests/:contestId', (req, res) => {
    dbo.collection("contests").findOne({ _id: ObjectId(req.params.contestId) })
        .then(contest => res.send(contest))
        .catch(console.error)
      });
    // let contest = contests[req.params.contestId];
    // contest.description = `Some description from api. This course id is ${req.params.contestId}`;

    // res.send(contest);

// run updateTestData.js
router.get('/updateIndex', (req, res) => {


    let contestCount = 0;
  dbo.collection('contests').find({}).toArray((err, resArr) => {
    assert.equal(null, err);
    
    resArr.forEach(contest => {
        if (!contest) { return; }
        contestCount++;
        dbo.collection('names')
        .find({ id: { $in: contest.nameIds }})
        .project({ _id: 1 })
        .toArray()
        .then(_ids => {
            const newIds = _ids.map(o => o._id);
            dbo.collection('contests').updateOne(
            { id: contest.id },
            { $set: { nameIds: newIds } }
            ).then(() => {
            console.info('Updated', contest._id);
            contestCount--;
            // if (contestCount === 0) { client.close(); }
            });
        })
        .catch(console.error);
    });
  });
  return res.send('.');

})

//add new name to db
router.post('/names', (req, res) => {
    console.log(req.body);
    const contestId = ObjectId(req.body.contestId);
    const proposedName = req.body.newName;

    dbo.collection('names').insertOne({ name: proposedName })
        .then(result => {
            console.log(result);
            dbo.collection("contests").updateOne(
                { _id: contestId },
                { $push: { nameIds: result.insertedId} }                
            ).then(doc => {
                dbo.collection("contests").findOne({ _id: contestId })
                    .then(contest => 
                        res.send({
                            updatedContest: contest,
                            newName: {_id: result.insertedId, name: proposedName }
                        }))
                }
                
            )
            }).catch(error => {
            console.error(error);
            res.status(404).send('error');
        });
});

///////////this code is for search for working function findAllAndUpdate deprecated


router.post('/namesFind', (req, res) => {
    console.log(req.body);
    const contestId = ObjectId(req.body.contestId);
    const proposedName = req.body.newName;
    const insertedId = ObjectId("62494a2292e63428afa97b3e");
    dbo.collection("contests").updateOne(
        { _id: contestId },        
        { $push: { nameIds: insertedId} },       
        function(err, object){         
            if(err){
                console.warn(err.message);
            }else{
                res.send({
                updatedContest: object.value,
                newName: {_id: insertedId, name: proposedName }
                })
            }
        }
    );
});






export default router;