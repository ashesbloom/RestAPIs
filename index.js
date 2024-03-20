const http = require('http');
const port = 8000;
const fs = require('fs');
const express = require('express');
const app = express();
// using a website called https://mockaroo.com/ to get the scrap data
const data = require('./MOCK_DATA.json');

//middleware - plugin
app.use(express.urlencoded({extended:false})) //this middleware will convert the data sent by the client into json object

app.get('/api/user',(req,res) => {
    return res.json(data);
})
app.get('/user',(req,res)=>{
    const html = `<ul>
    ${data.map((user)=>`<li>${user.first_name}</li>`).join('')}
    </ul>`
    return res.send(html);
})

//using postman api to testout client request

app.post('/api/user',(req,res)=>{
    //creating user
    const body = req.body; //data sent by the client get is stored in body
    console.log(body); //printing the data sent by the client 
    //but to understand the data we have to use middleware called urlencoded to change the data into json object
    data.push({id: data.length + 1,...body});  //pushing the body with the previous data
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(data),(err,pass)=>{ //rewritting new body pushed file with the old one 
        //avoid using appendfile to eliminate any duplicate entries
        return res.json(`Your data have be added id:${data.length}`);
    });
    
})

/*
 to get the user by id we have to create Dynamic path parameter
 GET /user/:id (we can achive that by using make dynamic variable {:id})
 */
app.route('/user/:id') //as, here pathname for GET,PATCH,DELETE is same so we will group the pathname together using route
    .get((req,res)=>{
        const id = Number(req.params.id); // calling the parameter id(pathname request by a client) and convert it to a number 
        const user = data.find((user_id)=>user_id.id===id); // finding the user by id
        return res.json(user);
    })
    .patch((req,res)=>{
        //edit user
        return res.json({status:'Pending...'});    
    })
    .delete((req,res)=>{
        //remove user
        return res.json({status:'Pending...'});    
    })



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})