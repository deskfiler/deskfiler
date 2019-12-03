# Deskfiler
<!--{h1:.massive-header.-with-tagline}-->

> An Open Source electron plugin ecosystem for JS developers that makes tools for the desktop on Windows, Mac and Linux
easily deployable and manageable as plugins.<br>

<img src="https://deskfiler.org/img/GithubHeader.jpg" style="max-width:100%;">

Get your binary downloads at [Deskfiler.org](https://www.deskfiler.org/)

## Table of Contents

* [Features](#features)
* [Contributing](#contributing)
* [Install and Quickstart](#install-and-quickstart)
* [Documentation](#documentation)
* [License](#license)

## Features
* Core app: Electron plugins platform. Run your custom JS plugin using systems API's provided by Deskfiler
* Handles either file input or custom UI rendered in isolated electron environment(s).
* Provides API's to work with file-system, raise system dialogs and access system resources to plugins.
* Add and remove plugins easily
* Extensive logging for business tasks: saves locally, what you have done and when
* Login management: if needed, create free accounts, log in and out as required
* Platform agnostic: Plugins work on all major desktop systems - the same!

## Contributing

Please read [Code of conduct](./docs/CODE_OF_CONDUCT.md) and [Contributing instructions](./docs/CONTRIBUTING.md)

## Install and Quickstart 
Works on Win, Mac and Linux

Your system needs the package manager yarn and a few npm packages to create Deskfiler from scratch:

1. Make sure your system can compile OS-specific node modules (build tools, see: https://github.com/nodejs/node-gyp)

2. Install yarn: https://yarnpkg.com/en/

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
   
## Documentation

All documentation resides [here](https://deskfiler.github.io/deskfiler/index.html)

## License

Deskfiler is published under the GPLv3. You will find the license within the code tree.
