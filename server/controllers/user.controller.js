const express = require('express');
const User = require('../DB/schema/user')

const router = express.Router();

module.exports.createUser = async (first_name, last_name, email, role, password, securityQuestion, securityAnswer) => {
    let user = {};
    user.first_name = first_name;
    user.last_name = last_name;
    user.email = email;
    user.role = role;
    user.password = password;
    user.securityQuestion = securityQuestion;
    user.securityAnswer = securityAnswer;

    let userModel = new User(user);
    await userModel.save()
        .then((user) => {
            return {
                userId: user._id
            }
        })
        .catch(error => {
            throw error;
        });
};
