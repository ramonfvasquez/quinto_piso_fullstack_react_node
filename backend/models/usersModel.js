const pool = require('./db');
const md5 = require('md5');

const deleteUser = async (id) => {
  try {
    let query2 = 'DELETE FROM Users WHERE UserId=?';

    await pool.query(query2, [id]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    query = 'SELECT * FROM Users WHERE UserId=? LIMIT 1';
    user = await pool.query(query, [id]);

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserByUsername = async (username) => {
  try {
    let query = 'SELECT * FROM Users WHERE UserUsername=? LIMIT 1';
    let user = await pool.query(query, [username]);

    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserByUsernameAndPassword = async (username, password) => {
  try {
    let query =
      'SELECT * FROM Users WHERE UserUsername=? AND UserPassword=? LIMIT 1';
    let rows = await pool.query(query, [username, md5(password)]);

    return rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUsers = async () => {
  try {
    let query = 'SELECT * FROM Users;';
    let users = await pool.query(query);

    return users;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const insertUser = async (username, password, name) => {
  try {
    let user = {
      UserUsername: username,
      UserPassword: md5(password),
      UserFullName: name,
    };

    let query = 'INSERT INTO Users SET ?';
    await pool.query(query, [user]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const sortByUsername = (array, isObjArr = false, inverse = false) => {
  let collator = new Intl.Collator('sp-u-co-trad');

  array.sort(function (a, b) {
    if (isObjArr) {
      if (inverse) {
        return collator.compare(b.UserUsername, a.UserUsername);
      } else {
        return collator.compare(a.UserUsername, b.UserUsername);
      }
    } else {
      return collator.compare(a, b);
    }
  });
};

const updateUser = async (user) => {
  let { UserId } = user;
  delete user.UserId;

  // let _user = null;

  // if (password in user) {
  //   _user = {
  //     UserPassword: md5(password),
  //   };
  // } else if (name in user || username in user) {
  //   _user = {
  //     UserUsername: username,
  //     UserFullName: name,
  //   };
  // }

  try {
    let query = 'UPDATE Users SET ? WHERE UserId=?';
    await pool.query(query, [user, UserId]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  deleteUser,
  getUserById,
  getUserByUsername,
  getUserByUsernameAndPassword,
  getUsers,
  insertUser,
  sortByUsername,
  updateUser,
};
