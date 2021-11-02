const express = require('express');
const router = express.Router();
const User = require('../DB/schema/user');
const jwt = require('jsonwebtoken');

router.use(express.json());

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
        res.json({status: 'OK', user: user});
    })
    .catch(error => {
      const tempObj = { ...error };
      delete tempObj.keyValue;
      res.json({ status: 'FAIL', details: tempObj }); // handle this from the backend
    });
});

// Route for login
router.post('/login', async(req, res) => {
    const email = req.body.email;
    await User.findOne({ email: email })
      .then((user) => {
          if(user) {

            console.log('user', user);
            const successfulUser = {
              email: user.email,
              firstName: user.first_name,
              last_name: user.last_name,
              role: user.role,
            };
            const accessToken = generateAccessToken(successfulUser);
            const refreshToken = jwt.sign(successfulUser, process.env.REFRESH_TOKEN_SECRET);
            refreshTokens.push(refreshToken); // Put it in database or some file during production
            res.json({
              status: 'OK',
              user: successfulUser,
              accessToken: accessToken,
              refreshToken: refreshToken
            });
          } else {
              res.json({status: 'FAIL', details: 'User not found'});
          }
      })
      .catch((error) => {
        const tempObj = { ...error };
        delete tempObj.keyValue;
        console.log('err', error.message)
        res.json({ status: 'FAIL', details: tempObj }); // handle this from the backend
      });
});

// Testing route for getting list of recipees by user
router.get('/recipees', authenticateToken, (req, res) => {
  console.log('request', req);
  res.json(recipees.filter((recipee) => recipee.email === req.user.email));
});

router.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if(refreshToken == null) return res.sendStatus(401);
  if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if(err) return res.sendStatus(403);
    const accessToken = generateAccessToken({email: user.email});
    res.json({ accessToken: accessToken });
  });
});

router.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter(token => token !== req.body.token);
  res.sendStatus(204);
});

module.exports = router;

// Middle wares and test data
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'15s'});
}

const recipees = [
  {
    email: 'subarna.khadka@acme.edu.np',
    title: 'subarna recipe',
  },
  {
    email: 'someoneelse@acme.edu.np',
    title: 'someoneelse recipe',
  },
];

let refreshTokens = []; // Put it in database or some file during production
