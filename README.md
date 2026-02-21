# FitBit

**FitBit** es una aplicación web de ejemplo que consume y administra datos de actividades físicas utilizando la API de Fitbit. Permite a los usuarios registrados ver, crear y editar actividades, y ofrece una sección de administración para gestionar usuarios.

---

## 📦 Tecnologías utilizadas

- Angular 21
- TypeScript
- SCSS
- Vitest para pruebas unitarias
- Angular CLI
- Firebase/Backend propio (ajustar según proyecto real)

---

## 🚀 Descripción del proyecto

Este proyecto forma parte de la asignatura DWES y demuestra:

1. Autenticación y autorización con JWT.
2. Uso de guards (`AuthGuard`, `RoleGuard`).
3. Consumo de servicios REST (`AuthService`, `ActivitiesService`, etc.).
4. Gestión de rutas y módulos de características.
5. Interceptores para añadir el token a cada petición.

La interfaz incluye login, registro, listado de actividades, formularios para crear/editar y un panel de administración.

---

## ⚙️ Requisitos y variables de entorno

Este proyecto **no cuenta con un backend propio**: utiliza directamente la API pública de Fitbit para obtener y enviar datos.

Por ello **no es necesario configurar variables de entorno** específicas para el servidor; los valores utilizados están codificados en los servicios.

Si en futuras ampliaciones se añade un backend o claves de terceros, se podrán declarar en `src/environments/environment.ts` o mediante variables del entorno de despliegue.


---

## 💻 Instalación y ejecución local

1. Clonar el repositorio:
   ```bash
    git clone https://github.com/AitorNieto/DWES-Proyecto-Fitbit-AitorNieto.git

    cd DWES-Proyecto-Fitbit-AitorNieto
    ```
2. Instalar dependencias:
   ```bash
    npm install
    ```
3. Levantar servidor de desarrollo:
    ```bash
    ng serve
    ```
4. Abrir [http://localhost:4200](http://localhost:4200) en el navegador. La aplicación recargará al guardar cambios.

---

## 🔑 Cuentas de prueba
En el registro se llamara a ala API para poder registrarse en la API, ahi tiene que ser un correo verdadero. Despues de autentificarse en la API, se redijira a la aplicacion con las credenciales de mi registro propio. Una vez hecho esto ya estara el factor d autenticacion pasado.

Para loguearse con las cuentas principales son estas credenciales: 

| Rol      | Usuario            | Correo | Contraseña   |
|----------|--------------------|--------|--------------|
| Usuario  | `usuario`| `usuario1@gmail.com` | `contraseñausuario`  |
| Admin    | `admin`| `admin1@gmail.com`| `contraseñaadmin`  |


---

## 🌐 URL de despliegue

La aplicación está disponible en:

```
https://fitbit-demo.example.com
```


---

## 📸 Capturas de pantalla

![Login](screenshots/login.png)
![Dashboard](screenshots/dashboard.png)

*(Agregar imágenes dentro del directorio `screenshots/` si se desea.)*

---

## 📄 Documentación adicional

- TSDoc en servicios principales (`AuthService`, `ActivitiesService`) y guards para facilitar el mantenimiento.
- Comentarios inline en métodos críticos.

---

## 📚 Recursos

- [Angular Documentation](https://angular.dev/docs)
- [Angular CLI](https://angular.dev/cli)

---

**¡Gracias por utilizar FitBit!**
