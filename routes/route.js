const express = require("express");
const router = express.Router();

const {handdleGetAllUser,handdleGetUser,handdleCreateUser,handdleGetUserByID,
    handdleUpdateUserByID,handdleDeleteUserByID} = require('../controllers/user.js'); //importing all the functions from user.js

//routes
router.get('/api',handdleGetAllUser);

router.route('/')
    .get(handdleGetUser)
    .post(handdleCreateUser);//using postman api to testout client request

/*
 to get the user by id we have to create Dynamic path parameter
 GET /user/:id (we can achive that by using make dynamic variable {:id})
 */
router.route('/:id')  //as, here pathname for GET,PATCH,DELETE is same so we will group the pathname together using route
    .get(handdleGetUserByID)
    .patch(handdleUpdateUserByID)
    .delete(handdleDeleteUserByID);


module.exports = router;