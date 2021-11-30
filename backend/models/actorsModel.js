const pool = require('./db');

const deleteActor = async (id) => {
  try {
    let query = 'DELETE FROM Actors WHERE ActorId=?';
    await pool.query(query, [id]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getActorById = async (id) => {
  let actor = null;
  let query = '';

  try {
    let actorWithPlays = await getActorsWithPlays(id);

    if (actorWithPlays.length > 0) {
      return actorWithPlays;
    } else {
      query = 'SELECT * FROM Actors WHERE ActorId=? LIMIT 1';
      actor = await pool.query(query, [id]);

      return actor;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getActorByName = async (name) => {
  try {
    let query = 'SELECT * FROM Actors WHERE ActorFullName=? LIMIT 1';
    let actor = await pool.query(query, [name]);

    return actor;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getActorIdByName = async (name) => {
  try {
    let query = 'SELECT ActorId FROM Actors WHERE ActorFullName=? LIMIT 1';
    let actor = await pool.query(query, [name]);
    actor = actor[0];

    return actor;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getActors = async () => {
  try {
    let queryAllActors = 'SELECT * FROM Actors';
    let allActors = await pool.query(queryAllActors);

    let actorsWithPlays = await getActorsWithPlays();

    for (let actor of allActors) {
      for (let actorWithPlays of actorsWithPlays) {
        if (actor.ActorId === actorWithPlays.ActorId) {
          actor.plays = actorWithPlays.plays;

          break;
        } else {
          actor.plays = [];
        }
      }
    }

    return allActors;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getActorsWithPlays = async (id = null, name = '') => {
  let textForQuery = '';

  if (id) {
    textForQuery = 'AND Actors.ActorId=?';
  } else if (name !== '') {
    textForQuery = 'AND Actors.ActorFullName=?';
  }

  try {
    let query = `SELECT Plays.PlayId, Plays.PlayTitle, Actors.ActorId,
                  Actors.ActorFullName, Actors.ActorCurriculumVitae,
                  Actors.ActorProfilePhoto
                  FROM PlaysActors
                    JOIN Actors
                      ON PlaysActors.ActorId=Actors.ActorId
                        ${textForQuery}
                    JOIN Plays
                      ON PlaysActors.PlayId=Plays.PlayId`;

    let actorsWithPlays = null;

    if (id) {
      actorsWithPlays = await pool.query(query, [id]);
    } else if (name !== '') {
      actorsWithPlays = await pool.query(query, [name]);
    } else {
      actorsWithPlays = await pool.query(query);
    }

    actorsWithPlays = actorsWithPlays.reduce(function (o, cur) {
      let occurs = o.reduce(function (n, item, i) {
        return item.ActorId === cur.ActorId ? i : n;
      }, -1);

      let play = {};
      play.PlayTitle = cur.PlayTitle;
      play.PlayId = cur.PlayId;

      if (occurs >= 0) {
        o[occurs].plays = o[occurs].plays.concat(play);
      } else {
        let actor = {
          ActorId: cur.ActorId,
          ActorFullName: cur.ActorFullName,
          ActorCurriculumVitae: cur.ActorCurriculumVitae,
          ActorProfilePhoto: cur.ActorProfilePhoto,
          plays: [play],
        };

        o = o.concat([actor]);
      }

      return o;
    }, []);

    return actorsWithPlays;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const insertActor = async (actor) => {
  try {
    let query = 'INSERT INTO Actors SET ?';
    await pool.query(query, [actor]);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const sortByName = (actors, inverse = false) => {
  let collator = new Intl.Collator('sp-u-co-trad');

  if (actors) {
    actors.sort(function (actor1, actor2) {
      if (inverse) {
        return collator.compare(actor2.ActorFullName, actor1.ActorFullName);
      } else {
        return collator.compare(actor1.ActorFullName, actor2.ActorFullName);
      }
    });
  }
};

const updateActor = async (actor) => {
  let { ActorId } = actor;
  delete actor.ActorId;

  try {
    let query1 = 'SET FOREIGN_KEY_CHECKS=0';
    await pool.query(query1);

    let query2 = 'UPDATE Actors SET ? WHERE ActorId=?';
    await pool.query(query2, [actor, ActorId]);

    let query3 = 'SET FOREIGN_KEY_CHECKS=1';
    await pool.query(query3);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  deleteActor,
  getActorById,
  getActorByName,
  getActorIdByName,
  getActors,
  getActorsWithPlays,
  insertActor,
  sortByName,
  updateActor,
};
