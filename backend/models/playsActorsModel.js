const pool = require('./db');

const deletePlaysActors = async (playsActors) => {
  try {
    let query = 'DELETE FROM PlaysActors WHERE ?';
    await pool.query(query, [playsActors]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPlaysActors = async () => {
  try {
    let query = 'SELECT * FROM PlaysActors';
    let rows = await pool.query(query);

    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const insertPlaysActors = async (playsActors) => {
  try {
    let query = 'INSERT INTO PlaysActors SET PlayId=?, ActorId=?';

    if (playsActors.plays) {
      for (let play of playsActors.plays) {
        await pool.query(query, [play, playsActors.ActorId]);
      }
    } else if (playsActors.actors) {
      for (let actor of playsActors.actors) {
        await pool.query(query, [playsActors.PlayId, actor]);
      }
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updatePlaysActors = async (idObj, playsActors) => {
  try {
    let query1 = 'SET FOREIGN_KEY_CHECKS=0';
    await pool.query(query1);

    await deletePlaysActors(idObj);
    await insertPlaysActors(playsActors);

    let query3 = 'SET FOREIGN_KEY_CHECKS=1';
    await pool.query(query3);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  deletePlaysActors,
  getPlaysActors,
  insertPlaysActors,
  updatePlaysActors,
};
