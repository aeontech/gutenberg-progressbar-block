This project was bootstrapped with [Create Guten Block](https://github.com/ahmadawais/create-guten-block).

## Setup
Dependencies must be installed before this plugin is usable.  
To install dependencies, run `npm install` in the root directory of the plugin.

## Deployment
In order to deploy this plugin to your wordpress instance, the following must be done:
- `npm install`: Installs NPM package dependencies.
- `npm run build`: Builds the scripts to be included on the frontend.

## `npm start`
- Use to compile and run the block in development mode.
- Watches for any changes and reports back any errors in your code.

## `npm run build`
- Use to build production code for your block inside `dist` folder.
- Runs once and reports back the gzip file sizes of the produced code.
