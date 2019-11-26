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

function init() {
  if (global.location.pathname.startsWith('/tickets.php/gvision/')) {
    const styles = `
      .top-bar {
        display: none;
      }
    `;
    addStyles(styles);
  }
  if (global.location.pathname === '/sothanks.php') {
    const callout = document.querySelector('.callout');
    const styles = `
      #backButton {
        background-color: #3adb76;
        color: #0a0a0a;
        padding: .85em 1em;
        margin: 1rem;
        cursor: pointer;
        font-size: .9rem;
      }
      .top-bar {
        display: none;
      }
    `;
    addStyles(styles);

    addButton({
      baseNode: callout,
      id: 'backButton',
      text: 'Back to Deskfiler',
      action: () => { global.close(); },
    });
    ipcRenderer.send('payment-recieved');
  }
}

window.addEventListener('DOMContentLoaded', () => {
  init();
});
