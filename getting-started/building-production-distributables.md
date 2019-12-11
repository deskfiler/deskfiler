# Building production distributables

Deskfiler utilizes [webpack]() to bundle it's JS code and [electron-builder]() to package it's native OS-level installers

## Instructions

To build distributable for your platform

  1. complete the installation process and verify that
local dev environment starts up
  2. run `export CSC_IDENTITY_AUTO_DISCOVERY=false` to disable code-signing
  3. run `yarn package` in root directory to start the packager
  4. after packaging is done, open `/dist` folder
  5. search for folder named after your platform for executables
