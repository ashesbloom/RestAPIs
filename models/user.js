const mongo = require('mongoose');

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

//exporting the model
module.exports = user;