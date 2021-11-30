const passwordMsgContainer = document.querySelector('#password-incorrect');
const txtConfirmPassword = document.querySelector('#confirm-password');
const txtPassword = document.querySelector('#password');

if (btnAddUser) {
  btnAddUser.addEventListener('click', function (e) {
    if (txtPasswordMsg()) {
      e.preventDefault();
    }
  });
}

if (txtConfirmPassword) {
  txtConfirmPassword.addEventListener('keydown', function () {
    txtPasswordMsg();
  });

  txtConfirmPassword.addEventListener('keyup', function () {
    txtPasswordMsg();
  });
}

if (txtPassword) {
  txtPassword.addEventListener('keydown', function () {
    txtPasswordMsg();
  });

  txtPassword.addEventListener('keyup', function () {
    txtPasswordMsg();
  });
}

const txtPasswordMatch = () => {
  for (let child of passwordMsgContainer.childNodes) {
    passwordMsgContainer.removeChild(child);
  }
};

const txtPasswordMsg = () => {
  if (
    txtPassword.value !== '' &&
    txtConfirmPassword.value !== '' &&
    txtPassword.value !== txtConfirmPassword.value
  ) {
    txtPasswordNotMatch();

    return true;
  } else if (txtPassword.value === '' || txtConfirmPassword.value === '') {
    txtPasswordMatch();

    return true;
  } else {
    txtPasswordMatch();

    return false;
  }
};

const txtPasswordNotMatch = () => {
  const passParag = document.createElement('p');
  const passText = document.createTextNode('Las contraseñas no coinciden.');

  passParag.appendChild(passText);

  for (let child of passwordMsgContainer.childNodes) {
    passwordMsgContainer.removeChild(child);
  }

  passwordMsgContainer.appendChild(passParag);
};
