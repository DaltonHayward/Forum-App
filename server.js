//DRH846
//11280305
//CMPT 353

'use strict';

// load package
const express = require('express');
const bodyParser = require("body-parser");
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const PORT = 8080;
const HOST = '0.0.0.0';
const app = express();
 
app.use(bodyParser.json());
app.use(cors());

var connection = mysql.createConnection({
    host    : 'mysql1',
    user    : 'root',
    password: 'admin'
});

// ***********************
//        DB SETUP
// ***********************
connection.connect();

// create database if it does not exist
connection.query('CREATE DATABASE IF NOT EXISTS chatdb', function (error,result) {
    if (error) throw error; 
    console.log('chatdb created');
});

// use database
connection.query('USE chatdb', function (error,result) {
    if (error) throw error;  
    console.log('Using chatdb');
});

// create users table in chatdb
var create_table = 'CREATE TABLE IF NOT EXISTS users (' +
'userID CHAR(33) NOT NULL UNIQUE, ' +
'username VARCHAR(15) NOT NULL UNIQUE, ' +
'password CHAR(60) NOT NULL, ' +
'isAdmin BOOLEAN, ' +
'PRIMARY KEY (userID))';

connection.query(create_table, function (error, result) {
    if (error) throw error; 
    console.log('Table users created!');
});  

// create servers table in chatdb
var create_table = 'CREATE TABLE IF NOT EXISTS servers (' +
'serverID CHAR(33) NOT NULL UNIQUE, ' +
'serverCreator VARCHAR(15) NOT NULL, ' +
'serverName VARCHAR(25) NOT NULL UNIQUE, ' +
'serverInfo VARCHAR(250), ' +
'PRIMARY KEY (serverID))';

connection.query(create_table, function (error, result) {
    if (error) throw error; 
    console.log('Table servers created!');
});  


bcrypt.hash('admin', 10, function(err, hashedPassword) {
    if (err) return console.log(err);
    
    connection.query(`INSERT IGNORE INTO users (userID, username, password, isAdmin) VALUES ('${uuidv4().replaceAll("-", "")}', 'admin', '${hashedPassword}', ${true})`, function (error, results) {
        if (error) {
            return console.log(error);
        }
    });
});  

// ***********************
//       LOGIN PAGE
// ***********************
app.get('/verifyLogin/:username/:password', (req, res) => {
    // retrieve password for given username to compare with given password
    connection.query('SELECT password FROM users WHERE username= '+ connection.escape(req.params.username), function (error, results) {
        if (error) return console.error(error.message);
        // compare given password with encrypted password in db
        if (results.length > 0) {
            bcrypt.compare(req.params.password, results[0].password, function(err, result) {
                if (err) return console.logr(error);
                res.status(200).send(result);
            });
        }
        else {
            res.status(200).send(results.json());
        }
    });          
});


// ***********************
//   REGISTER USER PAGE
// ***********************
app.post('/registerUser', (req, res) => {
    const userID = uuidv4().replaceAll("-", "");
    const username = req.body.username;
    const password = req.body.password;
    const saltRounds = 10;

    // hash password and add new user into database
    bcrypt.hash(password, saltRounds, function(err, hashedPassword) {
        if (err) return console.log(err);
        
        connection.query(`INSERT INTO users (userID, username, password, isAdmin) VALUES ('${userID}', '${username}', '${hashedPassword}', ${false})`, function (error, results) {
            if (error) {
                res.status(400); return console.log(error);
            }
            res.status(201).json({userID: userID, username: username, password: hashedPassword});
        });
    });          
});

app.get('/username/:username', (req, res) => {
    connection.query(`SELECT * FROM users WHERE username='${req.params.username}'`, function (error, results) {
        if (error) {
            res.status(400);
            return console.error(error.message);
        }
        res.status(200).send(results);
    });    
});


// ***********************
//        HOME PAGE
// ***********************
// get all servers
app.get("/servers", (req, res) => {
    connection.query(`SELECT * FROM servers`, function (error, results) {
        if (error) {
            res.status(400); return console.error(error.message);
        }
        res.status(200).send(results);
    });    
});

// delete server
app.delete("/server", (req, res) => {
    const serverID = req.body.serverID;

    connection.query(`DELETE FROM servers WHERE serverID='${serverID}'`, function (error, results) {
        if (error) {
            res.status(400); return console.error(error.message);
        }
        connection.query(`DROP TABLE ${serverID}_posts`), function (error, results) {
            if (error) {
                res.status(400); return console.error(error.message);
            }
        }
        connection.query(`DROP TABLE ${serverID}_votes`), function (error, results) {
            if (error) {
                res.status(400); return console.error(error.message);
            }
        }
        res.status(200).send(results);
    }); 
})

// ***********************
//   CREATE SERVER PAGE
// ***********************
app.post('/server', (req, res) => {
    const serverID = uuidv4().replaceAll("-", "");
    const serverCreator = req.body.serverCreator;
    const serverName = connection.escape(req.body.serverName);
    const serverInfo = connection.escape(req.body.serverInfo);
    
    // add new server to database
    connection.query(`INSERT INTO servers (serverID, serverCreator, serverName, serverInfo) VALUES ('${serverID}', '${serverCreator}', ${serverName}, ${serverInfo})`, function (error, results) {
        if (error) {
            res.status(400); return console.error(error.message);
        }

        const posts_table_name = `${serverID}_posts`;
        const votes_table_name = `${serverID}_votes`;

        var create_table = `CREATE TABLE IF NOT EXISTS ${posts_table_name} (` +
        'postID CHAR(33) NOT NULL UNIQUE, ' +
        'postUsername VARCHAR(15) NOT NULL, ' +
        'postData VARCHAR(250) NOT NULL, ' +
        'postTimestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
        'level INT NOT NULL DEFAULT 0, ' +
        'parentID CHAR(33) DEFAULT NULL, ' +
        'PRIMARY KEY (postID))' 

        connection.query(create_table, function (error, result) {
            if (error) {
                res.status(400); return console.log(error);
            } 
            console.log(`Table ${posts_table_name} created!`);
        });  
        
        var create_table = `CREATE TABLE IF NOT EXISTS ${votes_table_name} (` +
        'votePostID CHAR(33) NOT NULL, ' +
        'voteUserID CHAR(33) NOT NULL, ' +
        'PRIMARY KEY (votePostID, voteUserID))' 

        connection.query(create_table, function (error, result) {
            if (error) {
                res.status(400); return console.log(error);
            } 
            console.log(`Table ${votes_table_name} created!`);
        });  

        res.status(201).json({
            serverID: serverID,
            serverCreator: serverCreator, 
            serverName: serverName, 
            serverInfo: serverInfo,
            posts: posts_table_name,
            votes: votes_table_name
        });
    });
});


// ***********************
//      SERVER PAGE
// ***********************
// get all posts in serverID
app.get("/server/:serverID", (req, res) => {
    connection.query(`SELECT * FROM ${req.params.serverID}_posts`, function (error, results) {
        if (error) {
            res.status(400);
            return console.log(error);
        }
        res.status(200).send(results);
    }); 
});

// post a post to serverID
app.post("/server/:serverID", (req, res) => {
    const postID = uuidv4().replaceAll("-", "");
    const postUsername = req.body.postUsername;
    const postData = connection.escape(req.body.postData);
    const level = req.body.level;
    const parentID = req.body.parentID;

    if (parentID == null) {                                                                                                                    
        var query = `INSERT INTO ${req.params.serverID}_posts (postID, postUsername, postData, parentID) VALUES ('${postID}', '${postUsername}', ${postData}, null)`;
    }
    else {
        var query = `INSERT INTO ${req.params.serverID}_posts (postID, postUsername, postData, level, parentID) VALUES ('${postID}', '${postUsername}', ${postData}, '${level+1}', '${parentID}')`;
    }
        
    connection.query(query, function (error, results) {
        if (error) {
            res.status(400); return console.log(error);
        }
        res.status(201).json({
            postID: postID, 
            postUsername: postUsername, 
            postData: postData,
            parentID: parentID
        });
    });
});

// delete post from serverID
app.delete("/server/:serverID", (req, res) => {
    const postID = req.body.postID;

    connection.query(`DELETE FROM ${req.params.serverID}_posts WHERE postID='${postID}'`, function (error, results) {
        if (error) {
            res.status(400); return console.log(error);
        }
        res.status(201).send(results);
    });
});

// get all votes from server
app.get('/server/:serverID/votes', (req, res) => {
    const serverID = req.params.serverID;

    connection.query(`SELECT * FROM ${serverID}_votes`, function(error, results) {
        if (error) {
            res.status(400); return console.log(error);
        } 
        res.status(201).send(results);
    });
});

// add new vote from user in serverID
app.post('/server/:serverID/votes', (req, res) => {
    const voteUserID = req.body.userID;
    const votePostID = req.body.postID;

    connection.query(`INSERT IGNORE INTO ${req.params.serverID}_votes (votePostID, voteUserID) VALUES('${votePostID}', '${voteUserID}')`, function(error, results) {
        if (error) {
            res.status(400); return console.log(error);
        } 
        res.status(201).send(results);
    });
});

// delete vote from user in serverID
app.delete('/server/:serverID/votes', (req, res) => {
    const voteUserID = req.body.userID;
    const votePostID = req.body.postID;

    connection.query(`DELETE FROM ${req.params.serverID}_votes WHERE votePostID='${votePostID}' AND voteUserID='${voteUserID}'`, function(error, results) {
        if (error) {
            res.status(400); return console.log(error);
        } 
        res.status(201).send(results);
    });
});

// delete all votes on a post in serverID
// app.delete('/server/:serverID/votes/post', (req, res) => {
//     const votePostID = req.body.postID;

//     connection.query(`DELETE FROM ${req.params.serverID}_votes WHERE votePostID='${votePostID}'`, function(error, results) {
//         if (error) {
//             res.status(400); return console.log(error);
//         } 
//         res.status(201).send(results);
//     });
// });

app.listen(PORT, HOST);

console.log('up and running');