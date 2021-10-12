const express = require('express');
const router = express.Router();
const User = require('../DB/schema/user');

router.get('/', (req, res) => {
    res.send('Testing... testing');
});

// Route for registering a user
router.post('/register', async(req, res)=> {
    const{first_name, last_name, email, role, password} = req.body;
    let user = {};
    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    user.role = role;
    user.password = password;

    let userModel = new User(user);
    await userModel.save()
    .then((user) => {
        res.json({status: "OK", user: user});
    })
    .catch(error => {
      const tempObj = { ...error };
      delete tempObj.keyValue;
      res.json({ status: "FAIL", details: tempObj }); // handle this from the backend
    });
});

// Route for login
router.post('/login', async(req, res) => {
    const email = req.body.email;
    await User.findOne({ email: email })
      .then((user) => {
          if(user) {
               res.json({
                 status: "OK",
                 user: {
                   email: user.email,
                   firstName: user.first_name,
                   last_name: user.last_name,
                   role: user.role,
                 },
               });
          } else {
              res.json({status: "FAIL", details: "User not found"});
          }
      })
      .catch((error) => {
        const tempObj = { ...error };
        delete tempObj.keyValue;
        console.log('err', error.message)
        res.json({ status: "FAIL", details: tempObj }); // handle this from the backend
      });
});

module.exports = router;
