/*
@author: Emad Bin Abid, Muhammad Mehdi
@date: July 03, 2018
*/

//Application dependencies
    //custom dependencies
const server = require('./server');
require('./connection.mongoose');
const authentication = require('./authentication.mongoose');
const userRouter = require('./api/user/user.router');
const eventRouter = require('./api/event/event.router');
const organizationRouter = require('./api/organization/organization.router');
const imageRouter = require('./api/images/images.router');
const utils = require('./utils');
const path = require('path');

    //npm dependencies
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fileRoutes = require('./fileUpload');

const app = express();

//Middlewares
app.use(express.json());    //To parse json objects sent by the client.
app.use(cors({
    'credentials': true, 
    'Control-Allow-Methods': 'POST,GET,OPTIONS,PUT,DELETE'
}));
            //To resolve cross-origin browser issues.`

 //create necessary folders for file upload`
utils.createFolderIfNecessary(path.join(__dirname, './public'));
utils.createFolderIfNecessary(path.join(__dirname, './public/uploads'));

app.use('/file',fileRoutes);
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/dist'));

//Routes
userRouter.createRoutes(app, jwt, authentication.verifyToken);
eventRouter.createRoutes(app, jwt, authentication.verifyToken);
organizationRouter.createRoutes(app, jwt, authentication.verifyToken);
imageRouter.createRoutes(app);

//Validating the user on Login
authentication.validateUser(app, jwt);
//Running the server
server.run(app, process.env.PORT || 5000);
