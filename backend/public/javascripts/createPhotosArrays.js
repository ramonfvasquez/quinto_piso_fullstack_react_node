const btnAddActor = document.querySelector('#add-actor-btn');
const btnAddPlay = document.querySelector('#add-play-btn');
const btnEditActor = document.querySelector('#edit-actor-btn');
const btnEditPlay = document.querySelector('#edit-play-btn');
const deleteMsg = document.querySelector('#delete-photo-msg');
const newPhotos = document.querySelector('#new-photos-array');
const oldPhotos = document.querySelector('#old-photos-array');
const actorPhoto = document.querySelector('#actor-photo-array');
const ul = document.querySelector('#photos-list');
let newPhotosObj = {};

if (btnAddPlay) {
  btnAddPlay.addEventListener('click', function () {
    for (let key in newPhotosObj) {
      newPhotos.value += `${key},`;
    }
  });
}

if (btnEditPlay) {
  btnEditPlay.addEventListener('click', function () {
    oldPhotos.value = '';

    for (let li of ul.children) {
      oldPhotos.value += `${li.value},`;
    }

    for (let key in newPhotosObj) {
      newPhotos.value += `${key},`;
    }
  });
}

if (btnAddActor) {
  btnAddActor.addEventListener('click', function () {
    for (let key in newPhotosObj) {
      newPhotos.value += `${key},`;
    }
  });
}

if (btnEditActor) {
  btnEditActor.addEventListener('click', function () {
    if (newPhotosObj) {
      for (let key in newPhotosObj) {
        actorPhoto.value = `${key},`;
      }
    }
  });
}
