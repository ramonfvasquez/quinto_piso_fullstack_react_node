const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
  res.render('admin/home', {
    layout: 'admin/layout',
    name: req.session.name,
    sectionTitle: 'Administrador',
    username: req.session.username,
  });
});

module.exports = router;
