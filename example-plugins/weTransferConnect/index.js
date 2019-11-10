const createWTClient = require('@wetransfer/js-sdk');

async function transferFiles({ filePaths, fs, path }) {
  const apiKey = 'WDrVAC468y4xZNGcspeir8ySxfzV7YqQjSrBxNKh';

  const files = filePaths.map((fp) => {
    const { name, ext } = path.parse(fp);
    const { size } = fs.statSync(fp);
    const content = fs.readFileSync(fp);
    return { size, name: `${name}${ext}`, path: fp, content };
  });

  const wtClient = await createWTClient(apiKey);

  const transfer = await wtClient.transfer.create({
    message: 'Transfered from Deskfiler',
    files,
  });

  return transfer.url;
}

window.PLUGIN = {
  handleFiles: async ({
    inputs,
    context,
    system,
  }) => {
    const { fs, path } = system;
    const {
      log,
      exit,
      startProgress,
      finishProgress,
      resetProgress,
      alert,
    } = context;

    const { filePaths } = inputs;

    try {
      startProgress();
      const url = await transferFiles({ filePaths, fs, path });
      alert([{ url }]);
      finishProgress();
      log({
        action: `Transfered file${filePaths.length > 1 ? 's' : ''} to We Transfer storage`,
        meta: {
          type: 'text',
          value: url,
        },
      });
    } catch (err) {
      console.error(err);
      resetProgress();
    } finally {
      exit();
    }
  },
};
