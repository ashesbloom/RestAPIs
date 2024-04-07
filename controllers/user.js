const user = require('../models/user.js');

async function handdleGetAllUser(req,res){ //this function will get all the user from the database
    const alldbdata = await user.find({});
    return res.json(alldbdata);
}

async function handdleGetUser(req,res){  //this function will get all the user from the database in the form of html
    const alldbdata = await user.find({});
    const html = `<ul>
    ${alldbdata.map((user)=>`<li>name: ${user.firstname} | email: ${user.email} </li>`).join('')}
    </ul>`
    return res.send(html);
}

async function handdleCreateUser(req,res){ //this function will post the data to the database
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
        //     //avoid using routeendfile to eliminate any duplicate entries
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
    return res.status(201).json({msg: "User Successfully created", name: created_user._id});
}

async function handdleGetUserByID(req,res){ //this function will get the user by id from the database
    //finding user using id in scrap data[MOCK_DATA.json]
    
    // const id = Number(req.params.id); // calling the parameter id(pathname request by a client) and convert it to a number 
    // const user = data.find((user_id)=>user_id.id===id); // finding the user by id

    //finding user using id in our database
    const user_id = await user.findById(req.params.id);
    // handling not found 404
    if(!user_id) return res.status(404).json('User not found');
    return res.json(user_id);
}

async function handdleUpdateUserByID(req,res){  //this function will update the user by id from the database
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
}

async function handdleDeleteUserByID(req,res){  //this function will delete the user by id from the database
    await user.findByIdAndDelete(req.params.id) 
    return res.json({msg:'User Successfully deleted'});
}

//exporting functions
module.exports = {
    handdleGetAllUser,
    handdleGetUser,
    handdleCreateUser,
    handdleGetUserByID,
    handdleUpdateUserByID,
    handdleDeleteUserByID
}