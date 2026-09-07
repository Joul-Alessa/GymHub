# Documentación General

El proyecto se inició pensando en el uso de Ionic con React

## Inicialización

Los requerimientos de sistema con los que se trabajaron fueron los siguientes:

- Windows 11 (Alex) y Windows 10 (Pep)
- Node.js versión 22.11.0

Para su arranque se realizó la instalación de las herramientas de Ionic con el siguiente comando:

```
npm install -g @ionic/cli native-run cordova-res
```

La inicialización de archivos se hizo con el siguiente comando:

```
ionic start
```

Bajo las configuraciones:

- Framework: React
- Project name: App-Gym
- Template: my-first-app

Luego se añadió capacitor para soporte nativo de los sistemas móviles con el comando:

```
ionic capacitor add
```

Se añadió para android pero ya estaba soportado

Se nos brindaron las siguientes ayudas:

- Go to your cloned project: cd .\App-Gym
- Run ionic serve within the app directory to see your app in the browser
- Run ionic capacitor add to add a native iOS or Android project using Capacitor
- Generate your app icon and splash screens using cordova-res --skip-config --copy
- Explore the Ionic docs for components, tutorials, and more: https://ion.link/docs
- Building an enterprise app? Ionic has Enterprise Support and Features: https://ion.link/enterprise-edition