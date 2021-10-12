const express = require('express');
const router = express.Router();
const User = require('../DB/schema/user');

router.get('/', (req, res) => {
    res.send('Testing... testing');
});

router.post('/', async(req, res)=> {
    const{first_name, last_name, email, role, password} = req.body;
    console.log('request12345', req.body);
    let user = {};
    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    user.role = role;
    user.password = password;

    let userModel = new User(user);
    await userModel.save();
    res.json(userModel);
});

module.exports = router;