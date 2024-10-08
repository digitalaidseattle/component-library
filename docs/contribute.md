# Contributing to the library

This library is being built in a **monorepo**, a type of repository that holds multiple projects. Component libraries like [mantine](https://github.com/mantinedev) use a monorepo to break their library into smaller packages, while keeping it all maintained under one repository. 

For learning about monorepos, [monorepo.guide - getting started](https://monorepo.guide/getting-started) was a helpful resource. I also used this [starter kit](https://github.com/zhenyuluo/monorepo-starter) as a template for this repo.

The steps below are a condensed version that more directly applies to the DAS component library. I recommend reading the linked resource above for more details.

## Prerequisites
- [yarn classic](https://classic.yarnpkg.com/en/docs/install)
- npm account + access to our npm organization, if publishing

## Setting up a new package
1. Make a directory inside packages, along with a `package.json`. Make sure the name is scoped to `@digitalaidseattle`.
```
"name": "@digitalaidseattle/material",
"version": "1.0.0",
"description": "Material UI components commonly used in DAS ventures",
"repository": "git@github.com:digitalaidseattle/component-library.git",
```

2. Add the dependencies you need with `yarn add`. 
	- example: `yarn add react react-dom typescript`

3. Create a `src` directory, where the package's source code will be put.
	- At minimum, `src` needs an entry point: this is the file that programs will access first when interacting with your library. Typically, this file has all the exports for the functions and/or components your library contains.
	- The entry point must be indicated in `package.json` with the `main` field. It will need to follow this format: `"main": "dist/<package name>.cjs.js"`
	- Folder structure: to keep things tidy, it's a common practice to use a nested folder structure, where each folder exports its contents. 

### Configuring typescript 
- In the specific package directory:
	- Don't forget typescript dependency: `yarn add typescript`
	- Have an entry point that ends in `.ts` or `.tsx`
- In root directory (these were the changes made to the starter-kit; should be already set up.)
	- Make sure there is a global `ts.config` file, and change these settings:
		- `"jsx": "preserve" `  ensures jsx is compiled
		- `"isolatedModules": true`
	- In `babel.config`, make sure to add `@babel/preset-typescript` as a preset

## Building and publishing
Once you have some library code written and ready to test or publish, you can run `yarn build`, which runs the preconstruct tool to build all of the packages in the `packages` directory. If there are no errors, you can proceed to publishing!

To publish the package:
- First, make sure you have access to the digitalaidseattle organization on npm.
- In your terminal, run `npm login` to connect your machine to npm.
- Finally run `yarn release`. If it was a success, you should be able to see the package listed in our npm organization.

To document changes to the package (after the package has already been published!), you can use the changeset tool.
Changeset is what is used to document individual changes, then combines them all in a release. [monorepo.guide](https://monorepo.guide/getting-started#a-brief-explanation-of-changesets) explains this part well, but basically:
- run `yarn changeset add` and follow the prompts to document changes
- then run `yarn changeset version` to combine the changesets
