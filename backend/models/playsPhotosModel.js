const pool = require('./db');

const deletePlaysPhotos = async (id) => {
  try {
    let query = 'DELETE FROM PlaysPhotos WHERE ?';
    await pool.query(query, [id]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPlaysPhotos = async () => {
  try {
    let query = 'SELECT * FROM PlaysPhotos';
    let rows = await pool.query(query);

    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPlaysPhotosByPlayId = async (id) => {
  try {
    let query = 'SELECT * FROM PlaysPhotos WHERE ?';
    let rows = await pool.query(query, [id]);

    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const insertPlaysPhotos = async (playsPhotos) => {
  try {
    let query = 'INSERT INTO PlaysPhotos SET PlayId=?, PlayPhotoFileName=?';

    for (let photo of playsPhotos.photos) {
      await pool.query(query, [playsPhotos.PlayId, photo]);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const updatePlaysPhotos = async (photos) => {
  let { PlayId } = photos;

  try {
    let query1 = 'SET FOREIGN_KEY_CHECKS=0';
    await pool.query(query1);

    await insertPlaysPhotos(photos);

    let query3 = 'SET FOREIGN_KEY_CHECKS=1';
    await pool.query(query3);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  deletePlaysPhotos,
  getPlaysPhotos,
  getPlaysPhotosByPlayId,
  insertPlaysPhotos,
  updatePlaysPhotos,
};
