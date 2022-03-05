# GROUPOMANIA 
[![logo](backend/images/icon-above-fontPourReaME.png)](#)

## Projet P7


--------------------- 
## Précision sur les modules utilisés. Attention de bien respecter la version de chaque modules.

* Le backend a été réalisé avec nodejs version v16.13.0, express, sequelize, sequelize/cli, sql2.

* le frontend avec React, Redux, axios.

* Sass "^7.0.1" , a été utilisé pour la plus grande partie et material-ui pour quelques elements. 

* Il peut être utile de vérifier les modules dans le fichier package.json pour installer les packages manquants.

---------------------
## Routes backend

* Les routes utilisées pour la réalisation du projet sont listées dans le powerPoint joint au dossier.

----------------------
## Quelques informations utiles

* Veillez décompresser l'archive reçue ou faire un git clone.

* Veillez bien prendre la branch devSoutenance :

* https://github.com/Alexandre58/ThierryAlexandre_P7/tree/devSoutenance

* Dans le terminal intégré , ce placer dans le backend (npm install) et commande nodemon server.

* Dans le terminal intégré , ce placer dans le frontend (npm install) et commande npm start.

* Dans phpMyAdmin (ou autre) créer une base de donnée(nom) et importer la base de donnée qui se trouve dans le dossier backend => Database => mybase.sql.

* Changer le port et users password dans le fichier config => config.json pour la connexion correct à votre base de donnée.

* Un fichier .env.example a étais créé pour faciliter la gestion du point .env, renomer ou créer un fichier .env et rentrer vos données .(j'ai mis les codes ici pour facilité la mise en place pour la soutenance, ces codes seront éffacés par la suite).

--------------------------------------------

## frontend 

*  REACT_APP_API_URL= http://localhost:4000

* Les Packages utilisés:
* { "@emotion/react": "^11.7.1",
    "@emotion/styled": "^11.6.0",
    "@material-ui/core": "^4.12.3",
    "@material-ui/icons": "^4.11.2",
    "@mui/material": "^5.4.1",
    "@testing-library/jest-dom": "^5.16.2",
    "@testing-library/react": "^12.1.2",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^0.25.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "js-cookie": "^3.0.1",
    "node-sass": "^7.0.1",
    "react": "^17.0.2",
    "react-dom": "^17.0.2",
    "react-redux": "^7.2.6",
    "react-router-dom": "^5.3.0",
    "react-scripts": "5.0.0",
    "redux": "^4.1.2",
    "redux-devtools-extension": "^2.13.9",
    "redux-thunk": "^2.4.1",
    "web-vitals": "^2.1.4"
}

---------------------------------------

## backend

* TOKEN = "drxyctfugvhbujik84hf!!"

* PORT = "4000"

* Packages pour le backend:

* "dependencies": {
    "async": "^3.2.0",
    "bcrypt": "^5.0.1",
    "bcryptjs": "^2.4.3",
    "body-parser": "^1.19.0",
    "cors": "^2.8.5",
    "dotenv": "^10.0.0",
    "express": "^4.17.1",
    "fs": "0.0.1-security",
    "helmet": "^4.6.0",
    "jsonwebtoken": "^8.5.1",
    "moment": "^2.29.1",
    "morgan": "^1.10.0",
    "multer": "^1.4.2",
    "mysql": "^2.18.1",
    "mysql2": "^2.2.5",
    "nanoid": "^3.1.23",
    "path": "^0.12.7",
    "sequelize": "^6.6.2",
    "sequelize-cli": "^6.2.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.12"
  }
-------------------------------
* Un soucis avec sequelize et la base de donnée:

  dans le terminal backend : npm sequelize-cli db:migrate:undo(mise à l'etat precedent) puis  npm sequelize-cli db:migrate (migrate vers la base donnée).






