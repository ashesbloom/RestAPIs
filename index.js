const http = require('http');
const port = 8000;
const express = require('express');
const app = express();
// we will use a website called https://mockaroo.com/ to get the scrap data
const data = require('./MOCK_DATA.json');

app.get('/api/user',(req,res) => {
    return res.json(data);
})
app.get('/user',(req,res)=>{
    const html = `<ul>
    ${data.map((user)=>`<li>${user.first_name}</li>`).join('')}
    </ul>`
    return res.send(html);
})
/*
 to get the user by id we have to create Dynamic path parameter
 GET /user/:id (we can achive that by using make dynamic variable {:id})
 */
app.route('/user/:id') //as here pathname for GET,POST,PATCH,DELETE is same so we group the pathname together using route
    .get((req,res)=>{
        const id = Number(req.params.id); // here we will call the parameter id(pathname request by a client) and convert it to a number 
        const user = data.find((user_id)=>user_id.id===id); // here we will find the user by id
        return res.json(user);
    })
    .post((req,res)=>{
        //create user
        return res.json({status:'Pending...'});
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