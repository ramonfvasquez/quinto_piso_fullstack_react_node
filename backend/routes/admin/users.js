const express = require('express');
const router = express.Router();
const md5 = require('md5');
const usersModel = require('../../models/usersModel');

router.get('/', async (req, res, next) => {
  let users = await usersModel.getUsers().then((val) => {
    return val;
  });

  // Sort users by username
  usersModel.sortByUsername(users, (isObjArr = true));

  for (let user of users) {
    user.currentUser = req.session.username;
  }

  res.render('admin/users', {
    layout: 'admin/layout',
    content: users,
    name: req.session.name,
    section: 'users',
    sectionTitle: 'Usuarios',
    username: req.session.username,
  });
});

router.get('/add', async (req, res, next) => {
  res.render('admin/forms/addUserForm', {
    layout: 'admin/layout',
    name: req.session.name,
    section: 'users',
    sectionTitle: 'Agregar usuario',
    username: req.session.username,
  });
});

router.post('/add', async (req, res, next) => {
  let { username, userFullName, password, confirmPassword } = req.body;
  let userExists = false;
  let existingUser = null;

  try {
    if (
      username != '' &&
      userFullName != '' &&
      password != '' &&
      confirmPassword != ''
    ) {
      existingUser = await usersModel
        .getUserByUsername(username)
        .then((val) => {
          return val;
        });

      if (existingUser.length > 0) {
        userExists = true;
        throw error;
      } else {
        await usersModel.insertUser(username, password, userFullName);
      }

      res.redirect('/admin/users');
    } else {
      res.render('admin/error', {
        layout: 'admin/layout',
        errorMsg: 'Faltan datos.',
        error: true,
        name: req.session.name,
        section: 'user',
        username: req.session.username,
      });
    }
  } catch (error) {
    res.render('admin/error', {
      layout: 'admin/layout',
      errorMsg: 'No se guardó el usuario.',
      error: true,
      errorMsg: userExists
        ? `No se puede agregar a 
          <strong>
            ${username}
          </strong> 
          porque ya existe.
          <br>
          `
        : 'Hubo un error y no se guardó el usuario.',
      name: req.session.name,
      section: 'user',
      username: req.session.username,
    });
  }
});

router.get('/user/:id/delete', async (req, res, next) => {
  let user = await usersModel.getUserById(req.params.id);
  user = user[0];

  res.render('admin/forms/deleteUserForm', {
    layout: 'admin/layout',
    content: user,
    name: req.session.name,
    sectionTitle: 'Eliminar usuario',
    username: req.session.username,
  });
});

router.post('/user/:id/delete', async (req, res, next) => {
  try {
    let id_num = req.params.id;

    await usersModel.deleteUser(id_num);

    res.redirect('/admin/users');
  } catch (error) {
    throw error;
  }
});

router.get('/user/:id/edit', async (req, res, next) => {
  // Get the user by its ID
  let user = await usersModel.getUserById(req.params.id);
  user = user[0];

  res.render('admin/forms/editUserForm', {
    layout: 'admin/layout',
    content: user,
    name: req.session.name,
    sectionTitle: 'Editar usuario',
    username: req.session.username,
  });
});

router.post('/user/:id/edit', async (req, res, next) => {
  try {
    let { username, userFullName } = req.body;
    let user = {
      UserId: req.params.id,
      UserUsername: username,
      UserFullName: userFullName,
    };

    if (username && userFullName) {
      await usersModel.updateUser(user);

      res.redirect('/admin/users');
    } else {
      res.render('admin/error', {
        layout: 'admin/layout',
        errorMsg: 'Faltan datos.',
        error: true,
        name: req.session.name,
        username: req.session.username,
      });
    }
  } catch (error) {
    res.render('admin/error', {
      layout: 'admin/layout',
      errorMsg: 'No se pudo editar el usuario.',
      error: true,
      name: req.session.name,
      username: req.session.username,
    });
  }
});

router.get('/user/:id/change_password', async (req, res, next) => {
  // Get the user by its ID
  let user = await usersModel.getUserById(req.params.id);
  user = user[0];

  res.render('admin/forms/changeUserPasswordForm', {
    layout: 'admin/layout',
    content: user,
    name: req.session.name,
    sectionTitle: 'Cambiar contraseña',
    username: req.session.username,
  });
});

router.post('/user/:id/change_password', async (req, res, next) => {
  try {
    let { password } = req.body;
    let user = { UserId: req.params.id, UserPassword: md5(password) };

    if (password !== '') {
      await usersModel.updateUser(user);

      res.redirect('/admin/users');
    } else {
      res.render('admin/error', {
        layout: 'admin/layout',
        errorMsg: 'Faltan datos.',
        error: true,
        name: req.session.name,
        username: req.session.username,
      });
    }
  } catch (error) {
    console.log(error);
    res.render('admin/error', {
      layout: 'admin/layout',
      errorMsg: 'No se pudo cambiar la contraseña.',
      error: true,
      name: req.session.name,
      username: req.session.username,
    });
  }
});

module.exports = router;
