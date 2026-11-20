# ARQFAST · Prototipo web

Proyecto estudiantil en etapa de prototipo para estudiantes de Arquitectura de CECAR (Sincelejo, Sucre). Permite elegir un servicio, describir el encargo, solicitar una cotización por WhatsApp y consultar un pedido de ejemplo.

> Los datos de **Consultas** (ARQ-001, ARQ-002, ARQ-003) son de demostración. Precios, plazos y proveedores reales se confirman en el piloto.

## Cómo ejecutarlo

Es HTML, CSS y JavaScript puros, sin dependencias ni compilación.

- **Opción 1:** abre `index.html` con doble clic en tu navegador.
- **Opción 2 (servidor local):** `python3 -m http.server 8080` y entra a `http://localhost:8080`.

## Publicarlo en GitHub Pages

1. Crea un repositorio y sube estos archivos: `index.html`, `styles.css`, `app.js`, `README.md`.
2. En el repositorio: **Settings → Pages → Build and deployment → Deploy from a branch**.
3. Elige la rama `main` y la carpeta `/ (root)`, y guarda.
4. En un par de minutos estará en `https://TU-USUARIO.github.io/NOMBRE-DEL-REPO/`.

## Secciones

Inicio · Servicios · Cotizar · Cómo funciona · **Consultas** · Sobre el proyecto

## WhatsApp (Click to Chat)

Número: +57 300 437 7769 → `https://wa.me/573004377769`

- «Preguntar por WhatsApp»: abre el mensaje «Hola, ARQFAST. Tengo una pregunta sobre sus servicios».
- «Enviar solicitud por WhatsApp»: genera el mensaje con `https://wa.me/573004377769?text=${encodeURIComponent(mensaje)}`, que conserva saltos de línea, tildes y caracteres especiales.
- Click to Chat solo abre un **borrador** que el usuario revisa y envía.
- El archivo seleccionado en el formulario **no se sube a ningún servidor**: solo se incluye su nombre en el mensaje y el usuario debe adjuntarlo manualmente en el chat.

## Fase posterior (opcional)

Para automatizar mensajes se podría usar la **WhatsApp Cloud API** desde un backend con credenciales de Meta (token de acceso e ID del número). Nunca se deben poner esas credenciales en el código del navegador. La versión actual no las necesita.

## Estructura

```
index.html   estructura y contenido
styles.css   estilos (móvil primero)
app.js       servicios, formulario, WhatsApp y consultas de demostración
README.md    instrucciones
```
