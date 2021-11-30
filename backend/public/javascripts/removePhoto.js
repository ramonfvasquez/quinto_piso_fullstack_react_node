if (ul) {
  ul.addEventListener('click', function (e) {
    const preview = document.querySelector('.preview');
    let previewHeight = ul.children.length * 300;
    let target = e.target;

    if (target.tagName.toUpperCase() === 'LI') {
      target.parentNode.removeChild(target);
    } else if (target.tagName.toUpperCase() === 'IMG') {
      for (let key in newPhotosObj) {
        if (newPhotosObj[key] === target.src) {
          delete newPhotosObj[key];
        }
      }

      target.parentNode.removeChild(target);
    }

    preview.style.height = `${previewHeight}px`;

    if (actorPhoto) {
      actorPhoto.value = '';
    }

    if (ul.children.length === 0) {
      preview.style.margin = '0';
      deleteMsg.style.height = '0';
      deleteMsg.style.visibility = 'hidden';
    }
  });
}
