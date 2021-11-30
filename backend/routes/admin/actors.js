const express = require('express');
const router = express.Router();
const multer = require('multer');
const actorsModel = require('../../models/actorsModel');
const playsActorsModel = require('../../models/playsActorsModel');
const playsModel = require('../../models/playsModel');

// Multer for uploading files
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/actors');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
let upload = multer({ storage: storage });

// Actors page
router.get('/', async (req, res, next) => {
  // Get all actors
  let actors = await actorsModel.getActors().then((val) => {
    return val;
  });

  // Sort plays by title in actors object
  for (let actor of actors) {
    playsModel.sortByTitle(actor.plays, (isObjArr = true));
  }

  // Sort actors by name
  actorsModel.sortByName(actors);

  res.render('admin/actors', {
    layout: 'admin/layout',
    content: actors,
    name: req.session.name,
    sectionTitle: 'Actores',
    username: req.session.username,
  });
});

// Add actor - GET
router.get('/add', async (req, res, next) => {
  // Get the plays for the select element of the form
  let plays = await playsModel.getPlays().then((val) => {
    return val;
  });

  // Rename plays' titles to have the last years at the beginning of
  // the names
  let playsArr = [];

  for (let play of plays) {
    let playsObj = {};

    playsObj.PlayTitle = `[${play.PlayLastYear}] ${play.PlayTitle}`;
    playsObj.PlayId = play.PlayId;

    playsArr.push(playsObj);
  }

  // Sort plays by title
  // The titles start with the last years, so the plays are sorted by
  // year first, and then alphabetically
  playsModel.sortByTitle(playsArr, (isObjArr = true), (inverse = true));

  res.render('admin/forms/addActorForm', {
    layout: 'admin/layout',
    content: playsArr,
    name: req.session.name,
    sectionTitle: 'Agregar actor/actriz',
    username: req.session.username,
  });
});

// Add actor - POST
router.post('/add', upload.single('profilePhoto'), async (req, res, next) => {
  let { actorCV, actorName, actorPlays, newPhotosArray } = req.body;
  let actorExists = false;
  let existingActor = null;

  let newPhotos = newPhotosArray.split(',');
  for (let photo of newPhotos) {
    if (photo === '') {
      newPhotos.pop(newPhotos.indexOf(photo));
    }
  }

  try {
    // The name of the actors and at least one play are required
    if (actorName !== '') {
      let actor = {
        ActorFullName: actorName,
        ActorCurriculumVitae: actorCV,
        ActorProfilePhoto: newPhotos ? newPhotos[0] : null,
      };

      // Look for an actor with the same name as the one to be added
      existingActor = await actorsModel
        .getActorByName(actorName)
        .then((val) => {
          return val;
        });

      if (existingActor.length > 0) {
        actorExists = true;
        throw error;
      } else {
        await actorsModel.insertActor(actor);

        // Get the actor by its ID to insert its plays in the plays_actors table
        let actorId = await actorsModel
          .getActorIdByName(actorName)
          .then((val) => {
            return val.ActorId;
          });

        if (actorPlays) {
          let _actorPlays = { ActorId: actorId, plays: [] };

          // If only one play is selected, plays will be a string, otherwise it will
          // be an array
          // Insert one entry in the table plays_actors for each play of the actor
          if (actorPlays instanceof Array) {
            _actorPlays.plays = actorPlays;
          } else {
            _actorPlays.plays.push(actorPlays);
          }

          await playsActorsModel.insertPlaysActors(_actorPlays);
        }

        res.redirect('/admin/actors');
      }
    } else {
      res.render('admin/error', {
        layout: 'admin/layout',
        error: true,
        errorMsg: 'Faltan datos.',
        name: req.session.name,
        username: req.session.username,
      });
    }
  } catch (error) {
    console.log(error);
    res.render('admin/error', {
      layout: 'admin/layout',
      error: true,
      errorMsg: actorExists
        ? `No se puede agregar a 
          <strong>
            <a class='existing-actor' href='/admin/actors/actor/${existingActor[0].ActorId}'>${actorName}</a>
          </strong> 
          porque ya existe.
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
});

// Actor page
router.get('/actor/:id', async (req, res, next) => {
  // Get the actor by its ID
  let actor = await actorsModel.getActorById(req.params.id).then((val) => {
    return val;
  });
  actor = actor[0];

  // Sort plays by title
  playsModel.sortByTitle(actor.plays, (isObjArr = true));

  res.render('admin/actor', {
    layout: 'admin/layout',
    content: actor,
    id: actor.ActorId,
    name: req.session.name,
    section: 'actor',
    sectionTitle: actor.ActorFullName,
    username: req.session.username,
  });
});

// Delete actor - GET
router.get('/actor/:id/delete', async (req, res, next) => {
  let actor = await actorsModel.getActorById(req.params.id);
  actor = actor[0];

  res.render('admin/forms/deleteActorForm', {
    layout: 'admin/layout',
    content: actor,
    name: req.session.name,
    section: 'actor',
    sectionTitle: 'Eliminar actor/actriz',
    username: req.session.username,
  });
});

// Delete actor - POST
router.post('/actor/:id/delete', async (req, res, next) => {
  let id = req.params.id;

  try {
    await playsActorsModel.deletePlaysActors({ ActorId: id });
    await actorsModel.deleteActor(id);

    res.redirect('/admin/actors');
  } catch (error) {
    throw error;
  }
});

// Edit actor - GET
router.get('/actor/:id/edit', async (req, res, next) => {
  // Get the actor by its ID
  let actor = await actorsModel.getActorById(req.params.id);
  actor = actor[0];

  // Get the plays for the select element of the form
  let plays = await playsModel.getPlays().then((val) => {
    return val;
  });

  // Rename plays' titles to have the last years at the beginning of
  // the names, and set to false the selected property for each play
  for (let play of plays) {
    play.selected = false;
    play.PlayTitle = `[${play.PlayLastYear}] ${play.PlayTitle}`;
  }

  // If the actor has plays linked to it, check which ones are linked and which
  // ones not so as to select them in the select element
  if (actor.plays) {
    for (let play of plays) {
      for (let actorPlay of actor.plays) {
        if (actorPlay.PlayId === play.PlayId) {
          play.selected = true;
          break;
        } else {
          play.selected = false;
        }
      }
    }
  }

  actor.plays = plays;

  // Sort plays by title
  // The titles start with the last years, so the plays are sorted by
  // year first, and then alphabetically
  playsModel.sortByTitle(actor.plays, (isObjArr = true), (inverse = true));

  res.render('admin/forms/editActorForm', {
    layout: 'admin/layout',
    content: actor,
    name: req.session.name,
    section: 'actor',
    sectionTitle: 'Editar actor/actriz',
    username: req.session.username,
  });
});

// Edit actor - POST
router.post(
  '/actor/:id/edit',
  upload.single('profilePhoto'),
  async (req, res, next) => {
    let { actorName, actorCV, actorPlays, actorPhotoArray } = req.body;
    let actorId = req.params.id;
    let actorExists = false;
    let existingActor = null;

    let photo = actorPhotoArray.split(',');
    console.log(photo);

    try {
      // The name of the actor and at least one play are required
      if (actorName !== '') {
        let actor = {
          ActorId: actorId,
          ActorFullName: actorName,
          ActorCurriculumVitae: actorCV,
        };

        actor.ActorProfilePhoto = photo ? photo[0] : null;

        // Look for an actor with the same name as the one to be added
        existingActor = await actorsModel
          .getActorByName(actorName)
          .then((val) => {
            return val;
          });

        if (existingActor.length > 0 && existingActor[0].ActorId != actorId) {
          actorExists = true;
          throw error;
        } else {
          await actorsModel.updateActor(actor);

          if (actorPlays) {
            let playsActor = { ActorId: actorId, plays: [] };

            // If only one play is selected, plays will be a string, otherwise it will
            // be an array
            if (actorPlays instanceof Array) {
              playsActor.plays = actorPlays;
            } else {
              playsActor.plays.push(actorPlays);
            }

            await playsActorsModel.updatePlaysActors(
              { ActorId: actorId },
              playsActor
            );
          }

          res.redirect('/admin/actors');
        }
      } else {
        res.render('admin/error', {
          layout: 'admin/layout',
          error: true,
          errorMsg: 'Faltan datos.',
          name: req.session.name,
          username: req.session.username,
        });
      }
    } catch (error) {
      console.log(error);
      res.render('admin/error', {
        layout: 'admin/layout',
        error: true,
        errorMsg: actorExists
          ? `El nombre  
          <strong>
            <a class='existing-actor' href='/admin/actors/actor/${existingActor[0].ActorId}'>${actorName}</a>
          </strong> 
          ya existe.
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
