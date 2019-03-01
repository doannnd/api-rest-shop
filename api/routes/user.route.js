const express = require('express');
const mongoose = require('mongoose');
const chalk = require('chalk');

const User = require('../models/user.model');
const passwordHelper = require('../helpers/password.helper');

const router = express.Router();

router.post('/signup', (req, res, next) => {
    User.findOne({ email: req.body.email }).exec()
        .then((user) => {
            if (user) {
                res.status(409).json({
                    message: 'Email existed'
                });
            } else {
                console.log( passwordHelper.hashPassword(req.body.password));
                const user = new User({
                    _id: new mongoose.Types.ObjectId(),
                    email: req.body.email,
                    password: passwordHelper.hashPassword(req.body.password)
                });

                user.save().then((result) => {
                    if (result) {
                        console.log(chalk.yellow('Result sign up a user: ' + JSON.stringify(result)));
                        res.status(201).json({
                            message: 'User created',
                            createdUser: {
                                _id: result.id,
                                email: result.email,
                                password: result.password
                            }
                        });
                    } else {
                        res.status(404).json({
                            message: 'No Entries point'
                        });
                    }
                }).catch((err) => {
                    console.log(chalk.red(err));
                    res.status(500).json({
                        error: err
                    });
                });
            }
        }).catch((err) => {
            console.log(chalk.red(err));
            res.status(500).json({
                error: err
            })
        });
});

router.delete('/:userId', (req, res, next) => {
    const id = req.params.userId;
    User.deleteOne({_id: id}).exec()
    .then((result) => {
        if (result) {
            console.log(chalk.yellow('Result delete user by id: ' + JSON.stringify(result)));
            res.status(200).json({
                message: 'User deleted',
                request: {
                    type: 'POST',
                    description: 'CREATE_A_NEW_USER',
                    url: 'http://localhost:3000/user/signup',
                    body: {email: 'String', password: 'String'}
                }
            });
        } else {
            res.status(404).json({
                message: 'URL is invalid'
            });
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

module.exports = router;