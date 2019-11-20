const addTagline = ({ rootEl, shell }) => {
  const tagline = document.createElement('span');
  tagline.textContent = 'Deskfiler is an Open Source environment for professional Javascript plug-ins. You can start to develop your own tools quickly, based on this bareBone plug-in. Read here, how to start: ';
  tagline.style.display = 'inline-block';
  tagline.style.marginBottom = '8px';

  const deskfilerLink = document.createElement('a');
  deskfilerLink.href = '#';
  deskfilerLink.textContent = 'www.deskfiler.org';
  deskfilerLink.addEventListener('click', (e) => {
    e.preventDefault();
    shell.openExternal('https://www.deskfiler.org');
  });

  tagline.appendChild(deskfilerLink);
  rootEl.appendChild(tagline);
};

window.PLUGIN = {
  handleFiles: async ({
    inputs,
    context,
    system,
  }) => {
    const { shell } = system;
    const { filePaths } = inputs;
    const { exit, showPluginWindow, log } = context;

    await showPluginWindow();

    const rootEl = document.getElementById('root');

    const span = document.createElement('span');

    span.textContent = 'I have received an array of files from a drag&drop event.';

    log({
      action: 'Received files from drag&drop event',
      meta: {
        type: 'text',
        value: filePaths.join(';'),
      },
    });

    rootEl.appendChild(span);

    const br = document.createElement('br');

    rootEl.appendChild(br);

    const array = document.createElement('span');

    array.textContent = `The array contains: ${filePaths.join(';')}.`;
    array.style.display = 'block';
    array.style.marginBottom = '8px';
    rootEl.appendChild(array);

    addTagline({ rootEl, shell });

    const sumbitButton = document.createElement('button');
    sumbitButton.textContent = 'Exit';
    rootEl.appendChild(sumbitButton);

    sumbitButton.addEventListener('click', async () => {
      exit();
    });
  },
  handleOpen: async ({ context, system }) => {
    const { shell } = system;
    const { exit, log, selfDir, showPluginWindow } = context;

    const rootEl = document.getElementById('root');
    const span = document.createElement('span');
    span.textContent = `I have been clicked and opened the \
      template plugin.html hosted by deskfiler and loaded plugin javascript from directory \
      ${selfDir}.
    `;
    span.style.display = 'inline-block';
    span.style.marginBottom = '8px';

    const sumbitButton = document.createElement('button');
    sumbitButton.textContent = 'Exit';

    sumbitButton.addEventListener('click', () => {
      exit();
    });

    log({
      action: 'Opened with click',
    });

    rootEl.appendChild(span);
    addTagline({ rootEl, shell });
    rootEl.appendChild(sumbitButton);

    await showPluginWindow();
  },
};
