const pool = require('./db');

const deletePost = async (id) => {
  try {
    let query = 'DELETE FROM BlogPosts WHERE BlogPostId=?';

    await pool.query(query, [id]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPostById = async (id) => {
  try {
    query = 'SELECT * FROM BlogPosts WHERE BlogPostId=? LIMIT 1';
    post = await pool.query(query, [id]);

    return post;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPosts = async () => {
  try {
    let query = `SELECT * FROM BlogPosts`;
    posts = await pool.query(query);

    return posts;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const insertPost = async (post) => {
  try {
    let query = 'INSERT INTO BlogPosts SET ?';
    let rows = await pool.query(query, [post]);

    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const sortByDate = (a, b) => {
  if (a.BlogPostPublicationDate < b.BlogPostPublicationDate) {
    return 1;
  }

  if (a.BlogPostPublicationDate > b.BlogPostPublicationDate) {
    return -1;
  }

  return 0;
};

const updatePost = async (post) => {
  let { BlogPostId } = post;
  delete post.BlogPostId;

  try {
    let query = 'UPDATE BlogPosts SET ? WHERE BlogPostId=?';
    await pool.query(query, [post, BlogPostId]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const setDateString = (string) => {
  let date, month, year, hours, minutes;
  date = ('0' + string.getDate()).slice(-2);
  month = ('0' + string.getMonth()).slice(-2);
  year = string.getFullYear();
  hours = ('0' + string.getHours()).slice(-2);
  minutes = ('0' + string.getMinutes()).slice(-2);

  return `${date}/${month}/${year}, ${hours}:${minutes}`;
};

module.exports = {
  deletePost,
  getPostById,
  getPosts,
  insertPost,
  setDateString,
  sortByDate,
  updatePost,
};
