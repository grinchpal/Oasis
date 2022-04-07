const express = require('express');
const router = express.Router();
const data = require('../data/');
const mongoCollections = require('../config/mongoCollections');
const reviews = mongoCollections.reviews;

const xss = require('xss');

router.post('/register', async (req, res) => {
    let email = xss(req.body.email);
    let password = xss(req.body.password);
    try {
      if (!email || !password) {
        throw "All fields have to be non-empty"
      }
      if (!email.trim() || !password.trim()) {
        throw "Username and password cannot be empty"
      }
      if (password.indexOf(' ') >= 0) {
        throw "Password cannot contain spaces"
      }
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        throw "Email must be valid"
      }
      const result = await data.users.createUser(email, password);
      if (result.userInserted) {
        res.redirect('/login');
      }
    }
    catch (e) {
      res.status(403).render('user/register', {
        error: "Error : " + e,
        hasErrors: true,
        email: email,
        password: password
      });
      return;
    }
  });