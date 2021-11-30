const express = require('express');
const router = express.Router();
const actorsModel = require('./../models/actorsModel');
const blogModel = require('./../models/blogModel');
const playsModel = require('./../models/playsModel');
const usersModel = require('./../models/usersModel');

router.get('/obras', async function (req, res, next) {
  const plays = await playsModel.getPlays();

  for (let play of plays) {
    actorsModel.sortByName(play.actors);
  }

  plays.sort(playsModel.sortByLastYear);

  res.json(plays);
});

router.get('/blog', async function (req, res, next) {
  const posts = await blogModel.getPosts();

  posts.sort(blogModel.sortByDate);

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
  }

  res.json(posts);
});

module.exports = router;
