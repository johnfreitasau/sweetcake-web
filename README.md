<h1 align="center">
  <img src=".github/images/sweetcake.png" alt="SweetCake">
</h1>

<h3 align="center">
  SweetCake - Your favorite dessert shop next to you.
</h3>
<!-- E02041 -->
<p align="center">
  <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/johnfreitasau/sweetcake-web?color=%23FB8F0A">
  <a href="https://www.linkedin.com/in/johnfreitasau/"><img alt="Made by" src="https://img.shields.io/badge/made%20by-John%20Freitas-%23FB8F0A"></a>
  <img alt="Repository size" src="https://img.shields.io/github/repo-size/johnfreitasau/sweetcake-web?color=%23FB8F0A">
  <a href="https://github.com/johnfreitasau/sweetcake-web/commits/master"><img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/johnfreitasau/sweetcake-web?color=%23FB8F0A"></a>
  <a href="https://github.com/johnfreitasau/sweetcake-web/issues"><img alt="Repository issues" src="https://img.shields.io/github/issues/johnfreitasau/sweetcake-web?color=%23FB8F0A"></a>
  <img alt="GitHub" src="https://img.shields.io/github/license/johnfreitasau/sweetcake-web?color=%23FB8F0A">
</p>

<p align="center">
  <a href="#%EF%B8%8F-about-the-project">About the project</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-technologies">Technologies</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-getting-started">Getting started</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-how-to-contribute">How to contribute</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#-license">License</a>
</p>

<img alt="Layout" src=".github/sweetcake-web.png">

## 🦸‍♀️ About the project

Using the web client, the NGOs can create incidents informing about their needs and the amount to solve the incident.

With this informations and using the mobile client, people can help one or more incidents and be the hero for that NGO.

The goal of this project is increase the possibility of to help more cases and faster.

## 🚀 Technologies

Technologies that I used to develop this web client:

- [ReactJS](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [React Router DOM](https://reacttraining.com/react-router/)
- [React Icons](https://react-icons.netlify.com/#/)
- [UnForm](https://unform.dev/)
- [Styled Components](https://styled-components.com/)
- [Polished](https://github.com/styled-components/polished)
- [Axios](https://github.com/axios/axios)
- [date-fns](https://date-fns.org/)
- [polished](https://polished.js.org/)
- [react-datepicker](https://reactdatepicker.com/)
- [Yup](https://github.com/jquense/yup)
- [uuidv4](https://www.npmjs.com/package/uuidv4)
- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [EditorConfig](https://editorconfig.org/)


## 💻 Getting started

### Requirements

- [Node.js](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/)


**Clone the project and access the folder**

```bash
$ git clone https://github.com/johnfreitasau/sweetcake-web.git && cd sweetcake-web
```

**Install dependencies**

```bash
$ yarn
```

**Follow the steps below**

### Backend

In the backend folder:

```bash
yarn
```

To start the server:

```bash
yarn dev
```

#### Migrations
Update the database:
```bash
knex migrate:latest
```

To rollback all the completed migrations:
```bash
knex migrate:rollback
```

To run the next migration that has not yet been run:
```bash
knex migrate:up
```

To undo the last migration that was run:
```
knex migrate:down
```


### Web

_Obs.: Before to continue, be sure to have the API running_

In the frontend folder:
```bash
yarn
```

To start the project:
```bash
yarn start
```

### Mobile

_Obs.: Before to continue, be sure to have the API running_

```bash
# Be sure the file 'packages/mobile/src/services/api.ts' have the IP to your API

# Start the expo service and scan the QR code with Expo Client
$ yarn mobile expo
```

## 🤔 How to contribute

**Make a fork of this repository**

```bash
# Fork using GitHub official command line
# If you don't have the GitHub CLI, use the web site to do that.

$ gh repo fork johnfreitasau/sweetcake-web
```

**Follow the steps below**

```bash
# Clone your fork
$ git clone your-fork-url && cd sweetcake-web

# Create a branch with your feature
$ git checkout -b my-feature

# Make the commit with your changes
$ git commit -m 'feat: My new feature'

# Send the code to your remote branch
$ git push origin my-feature
```

After your pull request is merged, you can delete your branch

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
