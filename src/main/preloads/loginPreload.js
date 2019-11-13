const { ipcRenderer } = require('electron');

function addStyles(styles) {
  const css = document.createElement('style');
  css.type = 'text/css';
  css.appendChild(document.createTextNode(styles));
  document.getElementsByTagName('head')[0].appendChild(css);
}


function addButton({ baseNode, text, id, action }) {
  const button = document.createElement('button');
  button.setAttribute('id', id);
  button.textContent = text;
  button.addEventListener('click', (e) => {
    e.preventDefault();
    action();
  });
  baseNode.appendChild(button);
}

function getAuthToken() {
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.split('=').map(c => c.trim());
    acc[name] = value;
    return acc;
  }, {});

  return cookies.PHPSESSID;
}

function init() {
  // login pathnames
  if (global.location.pathname === '/') {
    const { children } = document.querySelector('.text-center');

    [...children].forEach((link) => {
      link.href = `${link.href}?hidehead=yes`; // eslint-disable-line no-param-reassign
    });


    const styles = `
      .grid-container {
        padding-top: 8% !important;
        display: flex;
        justify-content: center;
      }
    `;
    addStyles(styles);
  }

  if (global.location.pathname === '/pwlost.php') {
    const submitButton = document.querySelector('.button.warning.expanded');
    if (submitButton) {
      const styles = `
        .grid-container {
          padding-top: 8% !important;
          display: flex;
          justify-content: center;
        }
        .grid-container > .grid-x.grid-padding-x {
          max-width: 49%;
        }
        #backButton {
          background-color: #3adb76;
          color: #0a0a0a;
          padding: .85em 1em;
          margin: 0 0 1rem;
          cursor: pointer;
          font-size: .9rem;
          width: 100%;
        }
        #backButton:hover {
          background-color: #22bb5b;
        }
      `;

      addStyles(styles);

      addButton({
        baseNode: submitButton.parentNode,
        id: 'backButton',
        text: 'Back to Login',
        action: () => { window.location.href = 'https://plugins.deskfiler.org/?hidehead=yes&hideinfo=yes'; },
      });
    } else {
      const callout = document.querySelector('.callout');
      const styles = `
        #backButton {
          background-color: #3adb76;
          color: #0a0a0a;
          padding: .85em 1em;
          margin-top: 10px;
          cursor: pointer;
          font-size: .9rem;
        }
        #backButton:hover {
          background-color: #22bb5b;
        }
      `;

      addStyles(styles);

      addButton({
        baseNode: callout,
        id: 'backButton',
        text: 'Back to Login',
        action: () => { window.location.href = 'https://plugins.deskfiler.org/?hidehead=yes&hideinfo=yes'; },
      });
    }
  }

  if (global.location.pathname === '/my.php') {
    const preview = document.querySelector('pre');
    const user = JSON.parse(preview.innerText);
    ipcRenderer.send('logged-in', user);
    global.close();
  }

  // register pathnames
  if (global.location.pathname === '/register.php') {
    const { children } = document.querySelector('.fieldset');

    const privacyLink = [...children].find(c => c.href && c.href === 'https://plugins.deskfiler.org/privacy.php');

    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      global.location.href = 'https://plugins.deskfiler.org/privacy.php?hidehead=yes';
    });
  }
  if (global.location.pathname === '/privacy.php') {
    const lastSection = document.querySelector('.large-4.medium-12.cell').children[0];

    addButton({
      baseNode: lastSection,
      id: 'backButton',
      text: 'Back to Sign Up',
      action: () => {
        window.location.href = 'http://plugins.deskfiler.org/register.php?hidehead=yes';
      },
    });

    const styles = `
      .large-12.cell > div {
        max-height: none !important;
      }
      #backButton {
        background-color: #3adb76;
        color: #0a0a0a;
        padding: 10px;
        margin-top: 8px;
        cursor: pointer;
      }
      #backButton:hover {
        background-color: #22bb5b;
      }
    `;

    addStyles(styles);
  }
  if (global.location.pathname === '/reg2.php') {
    const callout = document.querySelector('.callout');

    const styles = `
      #closeButton {
        background-color: #3adb76;
        color: #0a0a0a;
        padding: 10px;
        margin-top: 8px;
        cursor: pointer;
      }
      #closeButton:hover {
        background-color: #22bb5b;
      }
    `;

    addButton({
      baseNode: callout,
      id: 'closeButton',
      text: 'Back to Deskfiler',
      action: () => { global.close(); },
    });

    addStyles(styles);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  init();
});
