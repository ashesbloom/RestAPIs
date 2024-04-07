//Main file

const port = 8000;
const express = require('express');
const app = express();

const user_route = require('./routes/route.js');             //exporting routes as user_route
const {connect_database} = require('./connection.js');       //importing the function from connection.js
const {logappend} = require('./middleware/checkpoint.js');   //importing the function from checkpoint.js

//connecting database
connect_database('mongodb://localhost:27017/servertesting-1')
    .then(()=>console.log('\tDatabase connected'))
    .catch((err)=>console.log(err));

//middleware - plugin
app.use(express.urlencoded({extended:false}))  //this middleware will convert the data sent by the client into json object
app.use(logappend('log.txt'));                 //this middleware will log the request made by the client

//routes
app.use('/user',user_route);     //passing the path to the user_route

//listening to the port   
app.listen(port, () => {
    console.log(`\n\tServer is running on port ${port}`);
})





// visit https://developer.mozilla.org/en-US/docs/Web/HTTP/Status for the understanding of the status code
// we can use a website called https://mockaroo.com/ to get the scrap data
// const data = require('./MOCK_DATA.json');
//but here we creating our own database using mongodb services

//status code
/* 
    Informational responses (100 – 199)
    Successful responses (200 – 299)
    Redirection messages (300 – 399)
    Client error responses (400 – 499)
    Server error responses (500 – 599)
*/