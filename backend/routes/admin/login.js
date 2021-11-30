const express = require('express');
const router = express.Router();
const usersModel = require('./../../models/usersModel');

// Login - GET
router.get('/', (req, res, next) => {
  res.render('admin/login', {
    layout: 'admin/layout',
    sectionTitle: 'Ingreso al Administrador',
  });
});

// Login - POST
router.post('/', async (req, res, next) => {
  try {
    let username = req.body.username;
    let password = req.body.password;

    let data = await usersModel.getUserByUsernameAndPassword(
      username,
      password
    );

    if (data != undefined) {
      req.session.loggedin = true;
      req.session.name = data.UserFullName;
      req.session.userId = data.UserId;
      req.session.username = data.UserUsername;

      res.redirect('home');
    } else {
      res.render('admin/login', {
        layout: 'admin/layout',
        error: true,
        sectionTitle: 'Ingreso al Administrador',
      });
    }
  } catch (error) {
    throw error;
  }
});

// Logout - GET
router.get('/logout', (req, res, next) => {
  req.session.destroy();

  res.render('admin/login', {
    layout: 'admin/layout',
    sectionTitle: 'Ingreso al Administrador',
  });
});

module.exports = router;
