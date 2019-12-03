# Creating a basic plugin

*in alpha stage*

1. Create your **plugin manifest** of following shape:

_manifest.json_

```json
{
  "name": "PLUGIN_NAME",
  "author": "PLUGIN_AUTHOR",
  "version": "1.0.0",
  "icon": "RELATIVE_PATH_TO_ICON"
}
```

2. Create `index.js` **entry file**, and define window.PLUGIN global variable to an
   object with either **handleFiles** method, **handleOpen** method or both.
   If some files are dropped on a plugin icon in Deskfiler main app, **handleFiles** method would be called,
   If plugin icon is clicked instead, plugin controller window will raise with empty HTML template and your **handleOpen** method would be called right after. Please refer to example plugins to see how it's implemented.

3. Add an icon for your plugin and set path to it in **manifest.json**

4. Tar your plugin files with tar cli tool. For example: `tar -cvf plugin.tar index.js manifest.json icon.png`

5. Now drop resulting archive on top of add plugin card on Deskfiler dashboard.

6. You should see your new plugin added to Deskfiler. Now either drop some files on it on open it with a mouseclick!

7. Customize your plugin code using Deskfiler API's
