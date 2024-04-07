// visit https://developer.mozilla.org/en-US/docs/Web/HTTP/Status for the understanding of the status code
const http = require('http');
const port = 8000;
const fs = require('fs');
const express = require('express');
const app = express();
// we can use a website called https://mockaroo.com/ to get the scrap data
// const data = require('./MOCK_DATA.json');
//but here we creating our own database using mongodb services
const { time } = require('console');
const mongo = require('mongoose');
const { type } = require('os');
const { create } = require('domain');

//connecting database
mongo.connect('mongodb://127.0.0.1:27017/servertesting-1')
    .then(()=>{console.log("Database connected")})
    .catch((err) => {console.log("mongo error",err)});

//schema
const userschema = new mongo.Schema({
    firstname:{
        type:String,
        require : true
    },
    lastname:{
        type:String,
        require: false
    },
    email:{
        type:String,
        require:true,
        unique:true,
    },
    gender:{
        type:String,
        require:true
    }
},
{timestamps:true} // to add timestamp in our database
);

//creating model
const user = mongo.model('user',userschema);
//using this user object we can perform CURD operations


//middleware - plugin
app.use(express.urlencoded({extended:false})) //this middleware will convert the data sent by the client into json object

app.use((req,res,next) => {
    const date = new Date().toLocaleDateString();
    const time = new Date().toLocaleTimeString();
    const log =  `Request made at: ${date}|${time}||${req.method}-${req.url}`;
    fs.appendFile('log.txt',log+'\n',(err)=>{
        if(err){
            console.log(err);
        }else{
            console.log('log added at '+date+' '+time);
            next();
        }
    })
})

app.get('/api/user',async(req,res) => {
    const alldbdata = await user.find({});
    return res.json(alldbdata);
})
app.get('/user',async(req,res)=>{
    const alldbdata = await user.find({});
    const html = `<ul>
    ${alldbdata.map((user)=>`<li>name: ${user.firstname} | email: ${user.email} </li>`).join('')}
    </ul>`
    return res.send(html);
})

//using postman api to testout client request

app.post('/api/user', async(req,res)=>{
    //creating user
    const body = req.body; //data sent by the client get is stored in body
    // handling bad request 400
    if(!body||!body.first_name || !body.last_name || !body.email){
        return res.status(400).json('All fields are required');
    }

    //this is the way to add data to the database in the form of local-file[log.txt]

    // console.log(body); //printing the data sent by the client 
    // //but to understand the data we have to use middleware called urlencoded to change the data into json object
    // data.push({id: data.length + 1,...body});  //pushing the body with the previous data
    // fs.writeFile("./MOCK_DATA.json",JSON.stringify(data),(err,pass)=>{ //rewritting new body pushed file with the old one 
    //     //avoid using appendfile to eliminate any duplicate entries
    //     return res.status(201).json(`Your data have be added id:${data.length}`);
    // });
    
    //adding data to the database
    const created_user = await user.create({
        firstname: body.first_name,
        lastname: body.last_name,
        email: body.email,
        gender: body.gender
    });
    console.log(created_user);
    return res.status(201).json({msg: "User Successfully created", name: created_user.firstname});
    
})

/*
 to get the user by id we have to create Dynamic path parameter
 GET /user/:id (we can achive that by using make dynamic variable {:id})
 */
app.route('/user/:id') //as, here pathname for GET,PATCH,DELETE is same so we will group the pathname together using route
    .get( async(req,res)=>{

        //finding user using id in scrap data[MOCK_DATA.json]
        
        // const id = Number(req.params.id); // calling the parameter id(pathname request by a client) and convert it to a number 
        // const user = data.find((user_id)=>user_id.id===id); // finding the user by id

        //finding user using id in our database
        const user_id = await user.findById(req.params.id);
        // handling not found 404
        if(!user_id) return res.status(404).json('User not found');
        return res.json(user_id);
    })
    .patch(async(req,res)=>{
        body = req.body;
        const user_id = await user.findById(req.params.id);
        if(!user_id) return res.status(404).json('User not found');
        const updated_user = await user.findByIdAndUpdate(user_id,{
            firstname: body.first_name || user_id.firstname,
            lastname: body.last_name || user_id.lastname,
            email: body.email || user_id.email,
            gender: body.gender || user_id.gender
        })
        if(!updated_user) return res.status(500).json('User not updated');
        return res.json({msg:'User Successfully updated'});
    })
    .delete( async(req,res)=>{
        await user.findByIdAndDelete(req.params.id) 
        return res.json({msg:'User Successfully deleted'});    
    })


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})


//status code
/* 
    Informational responses (100 – 199)
    Successful responses (200 – 299)
    Redirection messages (300 – 399)
    Client error responses (400 – 499)
    Server error responses (500 – 599)
*/