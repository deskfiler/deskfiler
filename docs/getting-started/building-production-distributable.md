To build distributable for your platform, 

  1. complete the installation process and verify that
local dev environment starts up, then
  2. run `export CSC_IDENTITY_AUTO_DISCOVERY=false` to disable code-signing
  3. run `yarn package` in root directory to start the packager, after it's done
  4. open `/dist` folder,
  5. search for folder named after your platform for executables
