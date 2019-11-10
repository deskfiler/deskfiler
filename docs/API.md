## API docs

Plugin handlers receive an objects as it's first argument.
Both **handleFiles** and **handleOpen** object contains `system` and `context` variables,
but, only **handleFiles** receives `inputs` which is an array of paths which were dropped on the plugin.

**system** - contains system-related functions
**context** - provides high-level functions to communicate with main deskfiler window.

```js
window.PLUGIN = {
  handleFiles: async ({
    inputs,
    system: {
      fs
    },
    context,
  }) => {
    console.log(inputs); // array of file paths dropped on the plugin
  },

  handleFiles: async ({
    system: {
      fs
    },
    context: { 
      notify,
      log,
      readUserInput,
      readFilePath,
    },
  }) => {
    console.log(fs) // fs module

    notify('Desktop notification') // sends desktop notification to user

    log('sent desktop notification') // writes a log entry to logfile

    const input = await readUserInput(); // Raises a modal with input in main window and passes it to plugin

    const pathToSave = await readFilePath(); // Raises a system path choose dialog and passes it to plugin
  },
}
```

#### System spec

As for now, system just fowards default node.js `fs` package to work with file-system

```js

/* Now purely node.js fs module to work with file-system */

{
  system: {
    fs
  }
}

```

#### Context spec

As for now, contains 4 basic methods to interact with Deskfiler core app.
```js

{
  context: {
    notify,
    log,
    readUserInput,
    readFilePath,
  }
}

```

