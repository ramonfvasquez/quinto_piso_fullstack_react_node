const btnAddUser = document.querySelector('#submit-user-btn');
const txtUsername = document.querySelector('#username');
const usernameMsgContainer = document.querySelector('#username-incorrect');

if (btnAddUser) {
  btnAddUser.addEventListener('click', function (e) {
    if (txtUsernameMsg(txtUsername.value)) {
      e.preventDefault();
    }
  });
}

if (txtUsername) {
  txtUsername.addEventListener('keydown', function () {
    txtUsernameMsg(txtUsername.value);
  });

  txtUsername.addEventListener('keyup', function () {
    txtUsernameMsg(txtUsername.value);
  });
}

const isValidUsername = (username) => {
  const res = /^[a-zA-Z0-9]+$/.exec(username);

  return !!res;
};

const txtRemoveInvalidUsernameMsg = () => {
  for (let child of usernameMsgContainer.childNodes) {
    usernameMsgContainer.removeChild(child);
  }
};

const txtShowInvalidUsernameMsg = () => {
  const passParag = document.createElement('p');
  const passText = document.createTextNode(
    'El nombre de usuario contiene caracteres inválidos.'
  );

  passParag.appendChild(passText);

  for (let child of usernameMsgContainer.childNodes) {
    usernameMsgContainer.removeChild(child);
  }

  usernameMsgContainer.appendChild(passParag);
};

const txtUsernameMsg = (username) => {
  if (isValidUsername(username) || username.length === 0) {
    txtRemoveInvalidUsernameMsg();

    return false;
  } else {
    if (username.length > 0) {
      txtShowInvalidUsernameMsg();
    }
    return true;
  }
};
