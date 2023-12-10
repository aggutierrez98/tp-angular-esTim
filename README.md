# Tp Final Integrador `EsTim`

Trabajo practico integrador final del curso de Angular de la UTN que incluye conocimientos de angular, HTML, CSS, Typescript y diseño UI y UX.
Se busca simular una aplicacion de venta de videojuegos donde se pueden crear y manipular juegos y sus respectivos generos. Tambien se pueden registrar y logear usuarios. Por ultimo se realizar compras de juegos mediante distintos metodos de pago y luego se puede prestar juegos entre los usuarios.

Projecto creado utilzando [Angular CLI](https://github.com/angular/angular-cli) version 17.0.5.

## Instalar dependencias

Instalar dependencias con el comando:

```shell
npm install
```

## Servidor de desarrollo

Correr el siguiente comando en la terminal:

```shell
npm run dev
```

De esta forma se levanta el servicio de _json server_ observando cambios y escuchando sobre el puerto 3000 por defecto. A su vez se levanta el servidor de desarrollo de angular en el puerto 4200 por defecto.

Luego dirigirse hacia `http://localhost:4200/` en el navegador. La aplicacion se refrescara automaticamente cuando sucede un cambio en el codigo.

## Build

Correr `ng build` para buildear el proyecto. La build de produccion se guardara en el directorio `dist/`.

## Correr tests unitarios

Correr `ng test` para ejecturar los tests unitarios de por medio de [Karma](https://karma-runner.github.io).
