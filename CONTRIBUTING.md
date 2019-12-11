# Contributing

When contributing to this repository, please first discuss the change you wish to make via issue,
email, or any other method with the owners of this repository before making a change.

Please note we have a code of conduct, please follow it in all your interactions with the project.

## GitFlow
We use [Vincent Driessen's branching model.](http://nvie.com/posts/a-successful-git-branching-model/)  
Read details here:  
- http://nvie.com/posts/a-successful-git-branching-model/  
- https://www.atlassian.com/git/tutorials/comparing-workflows#gitflow-workflow  
- http://danielkummer.github.io/git-flow-cheatsheet/  

Use [git-flow](https://github.com/petervanderdoes/gitflow-avh) package for working with branches.

#### git flow init
Use all init settings as default, except tag prefix, it must be 'v'.

## Commit changes

#### Conventional Commits
We use [conventional commits specification](https://conventionalcommits.org/) for commit messages.

#### Commitizen
To ensure that all commit messages are formatted correctly, you can use
[Commitizen](http://commitizen.github.io/cz-cli/) cli tool.
It provides interactive interface that creates your commit messages for you.

```sh
sudo npm install -g commitizen cz-customizable
```

From now on, instead of `git commit` you type `git cz` and let the tool do the work for you.

The following commit types are used on the project:
- **feat** - A new feature
- **fix**- A bug fix
- **improvement** - Improve a current implementation without adding a new feature or fixing a bug
- **docs** - Documentation only changes
- **style** - Changes that do not affect the meaning of the code(white-space, formatting, missing semi-colons, etc)
- **refactor** - A code change that neither fixes a bug nor adds a feature
- **perf** - A code change that improves performance
- **test** - Adding missing tests
- **chore** - Changes to the build process or auxiliary tools and libraries such as documentation generation
- **revert** - Revert to a commit
- **WIP** - Work in progress

You should strive for a clear informative commit message.
Read **[How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)**.

**Helpful hint**: You can always edit your last commit message, before pushing, by using:
```sh
git commit --amend
```

## Developing
Install dependecies:
```
yarn
```
Run dev process:
```
yarn dev
```

## Packaging
To package an app for production, please ensure that env variables are set.

```
  export DEBUG_PROD=<true|false>
  export DISABLE_MIXPANEL=<0|1>
  export SENTRY_DRY_RUN=<true|false>
  export GH_TOKEN=<github_token>
  export SENTRY_API_KEY=<your_sentry_api_key>
  export MIXPANEL_API_TOKEN=<your_mixpanel_api_token>
```

Then you can package an app with:

#### will include uploading sentry artifacts
```
  yarn build && yarn release
```

## Naming convention
Use airbnb naming conventions:  
- https://github.com/airbnb/javascript/tree/master/react#naming  
- https://github.com/airbnb/javascript#naming-conventions
#### Variables
Use declarative style and avoid single letter names.
If you use abbreveature leave comment with deciphering abbreviations.
#### Selectors
All selectors should have a 'get' prefix.
#### Actions
Actions must begin with some verb - set, fetch, fill, add, delete, etc...


## Containers and Components
* [Simple article about it](https://medium.com/@learnreact/container-components-c0e67432e005)
* [Dan Abramov about it](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0)

### Module Structure

This boilerplate uses a [two package.json structure](https://www.electron.build/tutorials/two-package-structure).
This means, you will have two `package.json` files.

1. `./package.json` in the root of your project
1. `./app/package.json` inside `app` folder

### Which `package.json` file to use

**Rule of thumb** is: all modules go into `./package.json` except native modules.
Native modules go into `./app/package.json`.

1. If the module is native to a platform (like system-idle-time) or otherwise should be included
with the published package (i.e. bcrypt, openbci), it should be listed under `dependencies` in `./app/package.json`.
2. If a module is `import`ed by another module, include it in `dependencies` in `./package.json`.
See [this ESLint rule](https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md).
Examples of such modules are `redux-saga`, `redux-form`, and `moment`.
3. Otherwise, modules used for building, testing and debugging should be included in `devDependencies` in `./package.json`.


## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a 
   build.
2. Update the README.md with details of changes to the interface, this includes new environment 
   variables, exposed ports, useful file locations and container parameters.
3. You may merge the Pull Request in once you have the sign-off of two other developers, or if you 
   do not have permission to do that, you may request the second reviewer to merge it for you.

