const express = require('express');
const router = express.Router();
const multer = require('multer');
const actorsModel = require('../../models/actorsModel');
const playsActorsModel = require('../../models/playsActorsModel');
const playsPhotosModel = require('../../models/playsPhotosModel');
const playsModel = require('../../models/playsModel');

// Multer for uploading files
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/plays');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
let upload = multer({ storage: storage });

// Plays page
router.get('/', async (req, res, next) => {
  try {
    // Get all plays
    let plays = await playsModel.getPlays().then((val) => {
      return val;
    });

    // Sort actors by name in plays object
    for (let play of plays) {
      actorsModel.sortByName(play.actors);
    }

    // Sort plays by last year
    plays.sort(playsModel.sortByLastYear);

    res.render('admin/plays', {
      layout: 'admin/layout',
      content: plays,
      name: req.session.name,
      sectionTitle: 'Obras',
      username: req.session.username,
    });
  } catch (error) {
    throw error;
  }
});

// Add play - GET
router.get('/add', async (req, res, next) => {
  try {
    // Get the actors for the select element of the form
    let actors = await actorsModel.getActors().then((val) => {
      return val;
    });

    // Sort actors by name for the select element of the form
    actorsModel.sortByName(actors);

    res.render('admin/forms/addPlayForm', {
      layout: 'admin/layout',
      content: actors,
      name: req.session.name,
      sectionTitle: 'Agregar obra',
      username: req.session.username,
    });
  } catch (error) {
    throw error;
  }
});

// Add play - POST
router.post('/add', upload.array('playPhotos', 20), async (req, res, next) => {
  let {
    playTitle,
    playAuthor,
    actors,
    firstYear,
    lastYear,
    playConception,
    playStaging,
    newPhotosArray,
  } = req.body;
  let playExists = false;
  let existingPlay = null;

  let newPhotos = newPhotosArray.split(',');
  for (let photo of newPhotos) {
    if (photo === '') {
      newPhotos.pop(newPhotos.indexOf(photo));
    }
  }

  // If lastYear is lower than firstYear, lastYear will be equal to firstYear
  firstYear = firstYear === '' ? 2000 : firstYear;
  lastYear = lastYear === '' || lastYear < firstYear ? firstYear : lastYear;

  try {
    // The title, the author, the first year, and at least one actor are required
    if (playTitle != '' && playAuthor != '') {
      let play = {
        PlayTitle: playTitle,
        PlayAuthor: playAuthor,
        PlayFirstYear: firstYear,
        PlayLastYear: lastYear,
        PlayConception: playConception ? playConception : null,
        PlayStaging: playStaging ? playStaging : null,
      };

      // Look for a play with the same title and first year as the one to be added
      existingPlay = await playsModel
        .getPlayByTitleAndYears(playTitle, firstYear, lastYear)
        .then((val) => {
          return val;
        });

      if (existingPlay.length > 0) {
        playExists = true;
        throw error;
      } else {
        await playsModel.insertPlay(play);

        // Get the play by its ID to insert its actors in the plays_actors table
        let playId = await playsModel.getPlayId(play).then((val) => {
          return val.PlayId;
        });

        if (actors) {
          let playActors = {
            actors: [],
            PlayId: playId,
          };

          // If only one actor is selected, actors will be a string; otherwise it will
          // be an array
          // Insert one entry in the table plays_actors for each actor of the play
          if (actors instanceof Array) {
            playActors.actors = actors;
          } else {
            playActors.actors.push(actors);
          }

          await playsActorsModel.insertPlaysActors(playActors);
        }

        let playPhotos = {
          PlayId: playId,
          photos: [],
        };

        for (let photo of newPhotos) {
          playPhotos.photos.push(photo);
        }

        await playsPhotosModel.insertPlaysPhotos(playPhotos);
      }

      res.redirect('/admin/plays');
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
      errorMsg: playExists
        ? `No se puede agregar la obra 
          <strong>
            <a href='/admin/plays/play/${
              existingPlay[0].PlayId
            }' id='existing-actor'>${playTitle}</a>
          </strong>
          [${firstYear}${lastYear === firstYear ? '' : '-' + lastYear}]
          porque ya existe.
          <br>
          <small>
            Hacé click en el título para ir a su página.
          </smal>
          `
        : 'Hubo un error y no se guardó la obra.',
      error: true,
      name: req.session.name,
      username: req.session.username,
    });
  }
});

// Play page
router.get('/play/:id', async (req, res, next) => {
  try {
    // Get the play by its ID
    let play = await playsModel.getPlayById(req.params.id).then((val) => {
      return val;
    });

    _play = play[0];

    // Sort actors by name
    actorsModel.sortByName(_play.actors);

    res.render('admin/play', {
      layout: 'admin/layout',
      content: _play,
      id: _play.PlayId,
      name: req.session.name,
      section: 'play',
      sectionTitle: _play.PlayTitle,
      username: req.session.username,
    });
  } catch (error) {
    throw error;
  }
});

// Delete play - GET
router.get('/play/:id/delete', async (req, res, next) => {
  try {
    let play = await playsModel.getPlayById(req.params.id);
    play = play[0];

    res.render('admin/forms/deletePlayForm', {
      layout: 'admin/layout',
      content: play,
      name: req.session.name,
      section: 'play',
      sectionTitle: 'Eliminar obra',
      username: req.session.username,
    });
  } catch (error) {
    throw error;
  }
});

// Delete play - POST
router.post('/play/:id/delete', async (req, res, next) => {
  let id = req.params.id;

  try {
    await playsPhotosModel.deletePlaysPhotos({ PlayId: id });
    await playsActorsModel.deletePlaysActors({ PlayId: id });
    await playsModel.deletePlay(id);

    res.redirect('/admin/plays');
  } catch (error) {
    throw error;
  }
});

// Edit actor - GET
router.get('/play/:id/edit', async (req, res, next) => {
  try {
    // Get the play by its ID
    let play = await playsModel.getPlayById(req.params.id);
    let _play = play[0];

    // Get the actors for the select element of the form
    let actors = await actorsModel.getActors().then((val) => {
      return val;
    });

    // Set to false the selected property for each actor
    for (let actor of actors) {
      actor.selected = false;
    }

    if (_play.actors) {
      for (let actor of actors) {
        for (let actorPlay of _play.actors) {
          if (actorPlay.ActorId === actor.ActorId) {
            actor.selected = true;
            break;
          } else {
            actor.selected = false;
          }
        }
      }
    }

    _play.actors = actors;

    // Sort plays by title
    // The titles start with the last years, so the plays are sorted by
    // year first, and then alphabetically
    actorsModel.sortByName(_play.actors);

    res.render('admin/forms/editPlayForm', {
      layout: 'admin/layout',
      content: _play,
      name: req.session.name,
      section: 'play',
      sectionTitle: 'Editar obra',
      username: req.session.username,
    });
  } catch (error) {
    throw error;
  }
});

// Edit play - POST
router.post(
  '/play/:id/edit',
  upload.array('playPhotos', 20),
  async (req, res, next) => {
    let {
      playTitle,
      playAuthor,
      firstYear,
      lastYear,
      actors,
      playConception,
      playStaging,
      oldPhotosArray,
      newPhotosArray,
    } = req.body;
    let playId = req.params.id;
    let playExists = false;
    let existingPlay = null;

    let oldPhotos = oldPhotosArray.split(',');
    oldPhotos.pop(oldPhotos[-1]);

    let newPhotos = newPhotosArray.split(',');
    for (let photo of newPhotos) {
      if (photo === '') {
        newPhotos.pop(newPhotos.indexOf(photo));
      }
    }

    // If lastYear is lower than firstYear, lastYear will be equal to firstYear
    firstYear = firstYear === '' ? 2000 : firstYear;
    lastYear = lastYear === '' || lastYear < firstYear ? firstYear : lastYear;

    try {
      // The title of the play and at least one actor are required
      if (playTitle != '' && playAuthor != '') {
        let play = {
          PlayId: playId,
          PlayTitle: playTitle,
          PlayAuthor: playAuthor,
          PlayFirstYear: firstYear,
          PlayLastYear: lastYear,
          PlayConception: playConception ? playConception : null,
          PlayStaging: playStaging ? playStaging : null,
        };

        existingPlay = await playsModel
          .getPlayByTitleAndYears(playTitle, firstYear, lastYear)
          .then((val) => {
            return val;
          });

        if (existingPlay.length > 0 && existingPlay[0].PlayId != playId) {
          playExists = true;
          throw error;
        } else {
          await playsModel.updatePlay(play);

          if (actors) {
            let playActors = { PlayId: playId, actors: [] };

            // If only one actor is selected, actors will be a string, otherwise it will
            // be an array
            if (actors instanceof Array) {
              playActors.actors = actors;
            } else {
              playActors.actors.push(actors);
            }

            // Update the table PlaysActors
            await playsActorsModel.updatePlaysActors(
              { PlayId: playId },
              playActors
            );
          }

          if (req.files !== undefined || oldPhotos.length > 0) {
            let playPhotos = {
              PlayId: playId,
              photos: [],
            };

            for (let photo of newPhotos) {
              playPhotos.photos.push(photo);
            }

            let savedPhotos = await playsPhotosModel.getPlaysPhotosByPlayId({
              PlayId: playId,
            });

            for (let saved of savedPhotos) {
              if (!oldPhotos.includes(saved.PlayPhotoId.toString())) {
                await playsPhotosModel.deletePlaysPhotos({
                  PlayPhotoId: saved.PlayPhotoId,
                });
              }
            }

            await playsPhotosModel.updatePlaysPhotos(playPhotos);
          }

          res.redirect('/admin/plays');
        }
      } else {
        console.log('edit play', error);
        res.render('admin/error', {
          layout: 'admin/layout',
          error: true,
          errorMsg: 'Faltan datos.',
          name: req.session.name,
          username: req.session.username,
        });
      }
    } catch (error) {
      console.log('edit play', error);
      res.render('admin/error', {
        layout: 'admin/layout',
        error: true,
        errorMsg: playExists
          ? `La obra 
          <strong>
            <a href='/admin/actors/actor/${existingPlay.PlayId}' id='existing-actor'>${title}</a>
          </strong>
          [${firstYear}] ya existe.
          <br>
          <small>
            Hacé click en el nombre para ir a su página.
          </smal>
          `
          : 'Hubo un error y no se guardó el actor/la actriz.',
        name: req.session.name,
        username: req.session.username,
      });
    }
  }
);

module.exports = router;
