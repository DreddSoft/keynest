![KeyNest Banner](./keynest_logo.png)

# README — KeyNest 🗝️

Plataforma web full-stack centralizada para la gestión de apartamentos turísticos, orientada a propietarios particulares y pequeños gestores del sector vacacional.

---

## ✨ Funcionalidades
- Frontend: **React + Vite + Tailwind CSS**
- Backend: **Java 17 + Spring Boot + JWT + JPA (Hibernate)**
- Base de datos: **PostgreSQL**
- Características clave: **Check-in digital**, **envío automatizado de correos**, **generación de facturas en PDF**
- Preparado para despliegue mediante Docker

---

## 📦 Tareas pendientes (TODO)

### Alta prioridad:
- Integración de pasarela de pago (Stripe o similar)
- Generación automática de contratos de alquiler en PDF

### Prioridad media:
- Panel de estadísticas (ocupación, ingresos)
- Soporte multilenguaje (ES / EN)

### Prioridad baja:
- Sincronización con calendarios externos (iCal, Google Calendar)
- Integración futura con channel managers (Airbnb, Booking, etc.)

### Futuro:
- Conversión del sistema a modelo SaaS multiusuario con planes de suscripción

---

## 🧱 Estructura del proyecto
├── keynest_backend/ # Backend con Spring Boot (API REST, JWT, base de datos)
├── keynest_frontend/ # Frontend con React (Vite + Tailwind CSS)
├── docs/ # Documentación del proyecto (diagramas, manuales)
├── docker/ # Configuraciones de Docker y docker-compose
├── .env.example # Archivo de ejemplo para variables de entorno
└── README.md # Este archivo


---

## 🛠 Tecnologías utilizadas

### Frontend
- React + Vite
- Tailwind CSS
- React Router DOM
- Persistencia de sesión con localStorage

### Backend
- Java 17
- Spring Boot
- Seguridad con JWT
- ORM con JPA (Hibernate)
- Generación de PDF (PDF Writer)
- Envío de correos con JavaMailSender (SMTP)

### DevOps y desarrollo
- Docker (contenedorización del backend y base de datos)
- PostgreSQL
- Postman (para pruebas de API)
- Git + GitHub (control de versiones)

---

## ⚙️ Requisitos para desarrollo

- Java 17
- Node.js 18+
- PostgreSQL 15+
- Docker (opcional para entorno local)
- IDEs recomendados: IntelliJ IDEA (backend) y VS Code (frontend)

---

## 🚀 Cómo ejecutar el proyecto localmente

### Backend
```bash
cd keynest_backend
./mvnw spring-boot:run
```

### Frontend
```bash
cd keynest_frontend
npm install
npm run dev
```

## Ejemplos de ficheros de configuración
### ENV
```ini
# .env
JWT_SECRET=EJEMPLO_DE_CLAVE_SECRETA_JWT_1231231KASKASDK123KMASMDASMD

# Email
MAIL_ACCOUNT=tu_direccion_de_email@email.com
MAIL_PASSWORD="tu password de aplicacion del email"
```

### application.properties
```bash
spring.application.name=keynest_backend

### JPA ###
spring.jpa.hibernate.ddl-auto=update
spring.datasource.url=jdbc:postgresql://localhost:5432/keynest_db
spring.datasource.username=keynest
spring.datasource.password=keynest
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

# Habilitar log de SQL
#logging.level.org.hibernate.SQL=DEBUG
#logging.level.org.hibernate.type.descriptor.sql=TRACE

# Habilitar log de Spring Boot
#logging.level.org.springframework=DEBUG

spring.mail.host=smtp.gmail.com
spring.mail.port=465
spring.mail.username=tu_direccion_de_email@email.com
spring.mail.password=tu pass de aplicacion de gmail
spring.mail.protocol=smtps
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=false
spring.mail.properties.mail.smtp.ssl.enable=true
```

