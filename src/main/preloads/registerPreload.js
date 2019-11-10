
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

function init() {
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
