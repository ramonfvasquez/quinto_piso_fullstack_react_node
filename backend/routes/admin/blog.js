const express = require('express');
const router = express.Router();
const blogModel = require('../../models/blogModel');
const usersModel = require('../../models/usersModel');

// Blog page
router.get('/', async (req, res, next) => {
  try {
    // Get all posts
    let posts = await blogModel.getPosts().then((val) => {
      return val;
    });

    let users = await usersModel.getUsers().then((val) => {
      return val;
    });

    for (let post of posts) {
      for (let user of users) {
        if (post.BlogPostAuthor == user.UserId) {
          post.BlogPostAuthor = {
            userId: user.UserId,
            username: user.UserUsername,
            userFullName: user.UserFullName,
          };
        }
      }

      post.BlogPostPublicationDate = blogModel.setDateString(
        post.BlogPostPublicationDate
      );

      post.currentUser = req.session.username;
    }

    // Sort posts by date
    posts.sort(blogModel.sortByDate);

    res.render('admin/posts', {
      layout: 'admin/layout',
      content: posts,
      name: req.session.name,
      sectionTitle: 'Blog',
      username: req.session.username,
    });
  } catch (error) {
    throw error;
  }
});

// Add post - GET
router.get('/add', async (req, res, next) => {
  try {
    res.render('admin/forms/addPostForm', {
      layout: 'admin/layout',
      name: req.session.name,
      sectionTitle: 'Agregar publicación',
      username: req.session.username,
    });
  } catch (error) {
    throw error;
  }
});

// Add post - POST
router.post('/add', async (req, res, next) => {
  let { postTitle, postBody } = req.body;
  let user = await usersModel.getUserByUsername(req.session.username);

  try {
    // The title and the body are required
    if (postTitle != '' && postBody != '') {
      let post = {
        BlogPostTitle: postTitle,
        BlogPostBody: postBody,
        BlogPostAuthor: user[0].UserId,
        BlogPostPublicationDate: new Date()
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '),
        BlogPostEdited: false,
      };

      await blogModel.insertPost(post);

      res.redirect('/admin/blog');
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
      errorMsg: 'Hubo un error y no se guardó la publicación.',
      error: true,
      name: req.session.name,
      username: req.session.username,
    });
  }
});

// Post page
router.get('/post/:id', async (req, res, next) => {
  try {
    // Get the post by its ID
    let post = await blogModel.getPostById(req.params.id).then((val) => {
      return val;
    });

    post = post[0];

    post.BlogPostPublicationDate = blogModel.setDateString(
      post.BlogPostPublicationDate
    );

    let user = await usersModel.getUserById(post.BlogPostAuthor).then((val) => {
      return val;
    });
    user = user[0];

    post.BlogPostAuthor = {
      userId: user.UserId,
      username: user.UserUsername,
      userFullName: user.UserFullName,
    };

    post.currentUser = req.session.username;

    res.render('admin/post', {
      layout: 'admin/layout',
      content: post,
      id: post.BlogPostId,
      name: req.session.name,
      section: 'post',
      sectionTitle: post.BlogPostTitle,
      username: req.session.username,
    });
  } catch (error) {
    throw error;
  }
});

// Delete post - GET
router.get('/post/:id/delete', async (req, res, next) => {
  try {
    let post = await blogModel.getPostById(req.params.id);
    post = post[0];

    res.render('admin/forms/deletePostForm', {
      layout: 'admin/layout',
      content: post,
      name: req.session.name,
      section: 'post',
      sectionTitle: 'Eliminar publicación',
      username: req.session.username,
    });
  } catch (error) {
    throw error;
  }
});

// Delete post - POST
router.post('/post/:id/delete', async (req, res, next) => {
  let id = req.params.id;

  try {
    await blogModel.deletePost(id);

    res.redirect('/admin/blog');
  } catch (error) {
    throw error;
  }
});

// Edit post - GET
router.get('/post/:id/edit', async (req, res, next) => {
  try {
    // Get the post by its ID
    let post = await blogModel.getPostById(req.params.id);
    post = post[0];

    post.BlogPostPublicationDate = blogModel.setDateString(
      post.BlogPostPublicationDate
    );

    console.log(post);

    res.render('admin/forms/editPostForm', {
      layout: 'admin/layout',
      content: post,
      name: req.session.name,
      section: 'post',
      sectionTitle: 'Editar publicación',
      username: req.session.username,
    });
  } catch (error) {
    throw error;
  }
});

// Edit play - POST
router.post('/post/:id/edit', async (req, res, next) => {
  let { postTitle, postBody } = req.body;
  let user = await usersModel.getUserByUsername(req.session.username);

  try {
    // The title and the body are required
    if (postTitle != '' && postBody != '') {
      let post = {
        BlogPostId: req.params.id,
        BlogPostTitle: postTitle,
        BlogPostBody: postBody,
        BlogPostAuthor: user[0].UserId,
        BlogPostPublicationDate: new Date()
          .toISOString()
          .slice(0, 19)
          .replace('T', ' '),
        BlogPostEdited: true,
      };

      await blogModel.updatePost(post);

      res.redirect('/admin/blog');
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
      errorMsg: 'Hubo un error y no se guardó la publicación.',
      error: true,
      name: req.session.name,
      username: req.session.username,
    });
  }
});

module.exports = router;
