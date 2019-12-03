# Quick Start

Just follow these instructions to get yourself set-up!

## OS-specific instructions

Deskfiler is a cross-platform Electron.js app, so you will need OS-level build tools to be able to build native dependencies such as `hummusjs`

### Windows

Make sure, you have the development tools to recompile node modules installed (eg. Visual Studio Community Edition)
- needed to run [node-gyp](https://github.com/nodejs/node-gyp).

### MacOS

On OSX, make sure to install the console tools for Xcode to recompile node modules as needed.

## Instructions

1. Ensure you have Node version 10.x or higher installed by running `node -v`,
   if you don't have `node` installed, refer to [Installing node appendix](#installing-node)
2. Ensure you have `yarn` installed or install it by either using `curl -o- -L https://yarnpkg.com/install.sh | bash` or downloading it from [here](https://yarnpkg.com/lang/en/docs/install)
3. Install required npm modules
   ```sh
   yarn global add cross-env concurrently
   ```
   "concurrently" is used in the build process to parallelize the build process. 
4. Check out and compile
    ```sh
    git clone https://github.com/deskfiler/deskfiler.git
    cd deskfiler
    npm install crc  # if you do not have it globally
    yarn install
    yarn bootstrap:plugins:all
    yarn build:plugins:all
    yarn dev
    ```
    Once checked out, you can also see your build options with
    ```sh
    yarn run
    ```

Done! You should now see blank Deskfiler window open with DevTools enabled.

## What's next?

Here you have two options either **working on Deskfiler core**, or **developing your own plugin**

### Deskfiler development

Dive into the code to understand how Deskfiler works from inside with help or the [architecture reference](../architecture/readme.md),
take a look at the [issues](https://github.com/deskfiler/deskfiler/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22+label%3A%22help+wanted%22)
and find yourself something you feel ready to tackle!

Dureing the developemnt, you may compile a production distributables for your system to test them, check [this guide](./building-production-distributables.md) to get to know how to do it

### Plugin Development

Most awesome thing about the deskfiler is that you can create your plugins for it obviously!
If you want to create something cool, please refer to [plugin development reference](../plugin-development/readme.md)

## Appendix

### Installing node

A nice way to manage node environment on your system in by using "Node Version Manager"
Install it using installation instructions on [their github repo](https://github.com/nvm-sh/nvm),
confirm it's installed by running `nvm -c` and then run `nvm install latest && nvm use latest`.

After downloading and installing node, nvm will create something like `virtualenv` for your node,
and you will see the latest node version installed which can also be verified with `node -v`
