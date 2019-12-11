# Overview

> This article is a stub. You can help by expanding it.

![Image of Yaktocat](https://i.imgur.com/25Rg4U2.png)

Deskfiler application shell is built on top on Electron.js framework.
Electron applications have main and renderer processes.

Main process has access to system resources and is capable of creating and managing Render processes which are basically Chromium BrowserWindow instances running arbitrary JavaScript code. Render processes are not exposed to system Node API's, therefore to perform system tasks, they must communicate with the main process in an RPC style.

Deskfiler main process is running Deskfile Core App renderer process, which renders app UI documented here. Main process listens for a signal from the main renderer to launch a plugin. A plugin is launched through a plugin controller renderer instance, which is a middle-ground in communications between plugin and main processes, as well as an API provider allowing the plugin to make use of some system functions.

