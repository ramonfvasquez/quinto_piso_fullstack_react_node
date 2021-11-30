function showPreviewPlay(event) {
  if (event.target.files.length > 0) {
    let index = 0;

    deleteMsg.style.height = 'fit-content';
    deleteMsg.style.visibility = 'visible';

    for (let file of event.target.files) {
      const img = document.createElement('img');
      const li = document.createElement('li');
      const src = URL.createObjectURL(file);

      img.className = 'photo new';
      img.addEventListener('click', function () {
        return this.parentNode.remove();
      });
      img.src = src;
      li.className = 'play-photo-item';
      li.value = index;

      index += 1;

      li.appendChild(img);

      ul.appendChild(li);

      const preview = document.querySelector('.preview');
      let previewHeight = ul.children.length * 300;

      preview.style.height = `${previewHeight}px`;
      preview.style.margin = '20px 0';
      preview.style.visibility = 'visible';

      newPhotosObj[file.name] = src;
    }
  }
}

function showPreviewActor(event) {
  for (let child of ul.children) {
    ul.removeChild(child);
  }

  if (ul.children.length === 0) {
    showPreviewPlay(event);
  }
}
