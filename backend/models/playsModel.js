const pool = require('./db');

const deletePlay = async (id) => {
  try {
    let query = 'DELETE FROM Plays WHERE PlayId=?';

    await pool.query(query, [id]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPlayById = async (id) => {
  let play = null;
  let query = '';

  try {
    let playWithActorsAndPhotos = await getPlays(id);

    if (playWithActorsAndPhotos.length > 0) {
      return playWithActorsAndPhotos;
    } else {
      query = 'SELECT * FROM Plays WHERE PlayId=? LIMIT 1';
      play = await pool.query(query, [id]);

      return play;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPlayByTitleAndYears = async (title, firstYear, lastYear) => {
  try {
    let query =
      'SELECT * FROM Plays WHERE PlayTitle=? AND (PlayFirstYear=? OR PlayLastYear=?) LIMIT 1';
    let play = await pool.query(query, [title, firstYear, lastYear]);

    return play;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPlayId = async (play) => {
  let { PlayTitle, PlayAuthor, PlayFirstYear, PlayLastYear } = play;

  try {
    let query =
      'SELECT PlayId FROM Plays WHERE PlayTitle=? AND PlayAuthor=? AND PlayFirstYear=? AND PlayLastYear=? LIMIT 1';
    let rows = await pool.query(query, [
      PlayTitle,
      PlayAuthor,
      PlayFirstYear,
      PlayLastYear,
    ]);

    return rows[0];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPlays = async (id = null) => {
  let textForQuery = '';

  if (id) {
    textForQuery = ' WHERE PlayId=?';
  }

  try {
    let queryAllPlays = `SELECT * FROM Plays${textForQuery}`;

    if (id) {
      allPlays = await pool.query(queryAllPlays, [id]);
    } else {
      allPlays = await pool.query(queryAllPlays);
    }

    let playsWithActors = await getPlaysWithActors(id);

    for (let play of allPlays) {
      for (let playAct of playsWithActors) {
        if (play.PlayId === playAct.PlayId) {
          play.actors = playAct.actors;
          break;
        } else {
          play.actors = [];
        }
      }
    }

    let playsWithPhotos = await getPlaysWithPhotos(id);
    for (let play of allPlays) {
      for (let playPhoto of playsWithPhotos) {
        if (play.PlayId === playPhoto.PlayId) {
          play.photos = playPhoto.photos;
          break;
        } else {
          play.photos = [];
        }
      }
    }

    return allPlays;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPlaysWithActors = async (id = null) => {
  let textForQuery = '';

  if (id) {
    textForQuery = 'AND Plays.PlayId=?';
  }

  try {
    let queryActors = `SELECT Plays.PlayId, Plays.PlayTitle, Plays.PlayAuthor, Plays.PlayFirstYear,
                        Plays.PlayLastYear, Actors.ActorId, Actors.ActorFullName, Actors.ActorCurriculumVitae, Actors.ActorProfilePhoto
                        FROM PlaysActors
                            JOIN Actors
                                ON PlaysActors.ActorId=Actors.ActorId
                            JOIN Plays
                                ON PlaysActors.PlayId=Plays.PlayId
                                  ${textForQuery}`;

    let playsWithActors = null;

    if (id) {
      playsWithActors = await pool.query(queryActors, [id]);
    } else {
      playsWithActors = await pool.query(queryActors);
    }

    playsWithActors = playsWithActors.reduce(function (o, cur) {
      let occurs = o.reduce(function (n, item, i) {
        return item.PlayId === cur.PlayId ? i : n;
      }, -1);

      let actor = {};
      actor.ActorFullName = cur.ActorFullName;
      actor.ActorId = cur.ActorId;
      actor.ActorCurriculumVitae = cur.ActorCurriculumVitae;
      actor.ActorProfilePhoto = cur.ActorProfilePhoto;

      if (occurs >= 0) {
        o[occurs].actors = o[occurs].actors.concat(actor);
      } else {
        let obj = {
          PlayId: cur.PlayId,
          PlayTitle: cur.PlayTitle,
          PlayAuthor: cur.PlayAuthor,
          PlayFirstYear: cur.PlayFirstYear,
          PlayLastYear: cur.PlayLastYear,
          actors: [actor],
        };

        o = o.concat([obj]);
      }

      return o;
    }, []);

    return playsWithActors;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPlaysWithPhotos = async (id = null) => {
  let textForQuery = '';

  if (id) {
    textForQuery = 'AND Plays.PlayId=?';
  }

  try {
    let queryPhotos = `SELECT Plays.PlayId, PlaysPhotos.PlayPhotoId, PlaysPhotos.PlayPhotoFileName
                        FROM PlaysPhotos
                          JOIN Plays
                            ON PlaysPhotos.PlayId = Plays.PlayId
                              ${textForQuery}`;

    let playsWithPhotos = null;

    if (id) {
      playsWithPhotos = await pool.query(queryPhotos, [id]);
    } else {
      playsWithPhotos = await pool.query(queryPhotos);
    }

    playsWithPhotos = playsWithPhotos.reduce(function (o, cur) {
      let occurs = o.reduce(function (n, item, i) {
        return item.PlayId === cur.PlayId ? i : n;
      }, -1);

      if (occurs >= 0) {
        o[occurs].photos = o[occurs].photos.concat({
          photoId: cur.PlayPhotoId,
          fileName: cur.PlayPhotoFileName,
        });
      } else {
        let obj = {
          PlayId: cur.PlayId,
          photos: [
            { photoId: cur.PlayPhotoId, fileName: cur.PlayPhotoFileName },
          ],
        };

        o = o.concat([obj]);
      }

      return o;
    }, []);

    return playsWithPhotos;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const insertPlay = async (play) => {
  try {
    let query = 'INSERT INTO Plays SET ?';
    let rows = await pool.query(query, [play]);

    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const sortByLastYear = (a, b) => {
  if (a.PlayLastYear < b.PlayLastYear) {
    return 1;
  }

  if (a.PlayLastYear > b.PlayLastYear) {
    return -1;
  }

  return 0;
};

const sortByTitle = (array, isObjArr = false, inverse = false) => {
  let collator = new Intl.Collator('sp-u-co-trad');

  if (array) {
    array.sort(function (a, b) {
      if (isObjArr) {
        if (inverse) {
          return collator.compare(b.PlayTitle, a.PlayTitle);
        } else {
          return collator.compare(a.PlayTitle, b.PlayTitle);
        }
      } else {
        return collator.compare(a, b);
      }
    });
  }
};

const updatePlay = async (play) => {
  let { PlayId } = play;
  delete play.PlayId;

  try {
    let query1 = 'SET FOREIGN_KEY_CHECKS=0';
    await pool.query(query1);

    let query2 = 'UPDATE Plays SET ? WHERE PlayId=?';
    await pool.query(query2, [play, PlayId]);

    let query3 = 'SET FOREIGN_KEY_CHECKS=1';
    await pool.query(query3);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  deletePlay,
  getPlaysWithActors,
  getPlaysWithPhotos,
  getPlayById,
  getPlayByTitleAndYears,
  getPlayId,
  getPlays,
  insertPlay,
  sortByLastYear,
  sortByTitle,
  updatePlay,
};
