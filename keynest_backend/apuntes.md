# Apuntes varios

## ¿Qué es el patrón de diseño Builder?
Builder es un patrón de diseño creacional que nos permite construir objetos complejos paso a paso.
El patrón nos permite producir distintos tipos y representaciones de un objeto empleando el mismo código de construcción.

El patrón organiza la construcción del objeto en una serie de pasos. No es necesario invocar todos los pasos, puedes invocar solo aquellos que sean necesarios para producir una configuración particular.

## Clase User Details
Tiene varias ventajas usar la clase UserDetails como padre de nuestro objeto User:
#### Integración directa con Spring Security:
Spring Security usa ``UserDetails`` para trabajar internamente con usuarios. Implementarla permite:
- Permosaliza cómo Spring obtiene los usuarios.
- Dejar que Spring maneje la autenticación, autorización JWT, sesiones, etc.

#### Abstracción 
Permite separar los datos de la entidad User del mecanismo de seguridad.

#### Flexibilidad
Permite usar la misma interfaz para usuarios en memoria, usuarios en base de datos o incluso APIs externas.

#### Permisos y roles
El método ``getAuthorities()`` permite devolver una lista de roles que luego podemos usar con anotaciones como ``@PreAuthorize(¨hasRole(¨ADMIN¨)¨)``.

Además nos implementa unos método s para controlar si el usuario está desactivado, si está bloqueado por intentos fallidos, contraseñas caducadas o cuentas que expiran.

#### Simplifica el uso del ``AuthenticationManager``
No necesita adaptadores adicionales.