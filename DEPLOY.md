# Deploy en GitHub Pages — paso a paso

Orden recomendado para tener el sitio online hoy. Los pasos 1 a 4 publican el sitio; el 5 y el 6 suman Drive e Instagram sin tocar código.

**Lo único que hay que cargar en GitHub:** el secret `GOOGLE_API_KEY` (paso 5) y, cuando esté, `INSTAGRAM_ACCESS_TOKEN` (paso 6). Dominio, carpeta de Drive y cuenta de Instagram ya están en el código.

> **Secretos (API key, tokens): nunca en el código ni en el chat.** Van en GitHub → Settings → Secrets.

---

## Datos de este sitio

| | |
|---|---|
| Repo | [Escuela-Secundaria-N17/Landing](https://github.com/Escuela-Secundaria-N17/Landing) |
| Dominio | `secundaria17lapoeta.edu.ar` (+ `www.`) |
| Carpeta de Drive | [Bibliografia](https://drive.google.com/drive/folders/1-QhZcESMRuZJnU6Kt-lUWIyqVc9RHJL2) (ya configurada por defecto en el deploy) |
| Instagram | [@escpoetaortiz17](https://www.instagram.com/escpoetaortiz17/) |
| `/ESJA` | redirige a `https://sites.google.com/view/lapoetamuestra/inicio` (en `src/content/site.ts` → `redirects`) |

## 1. Subir el proyecto

En tu máquina, dentro de la carpeta del proyecto descomprimido:

```bash
npm install              # genera package-lock.json
npm run typecheck        # debería terminar sin errores
npm run dev              # mirar el sitio en http://localhost:5173
git init -b main
git add .
git commit -m "Sitio La Poeta: MVP"
git remote add origin https://github.com/Escuela-Secundaria-N17/Landing.git
git push -u origin main
```

Si el repo ya tiene un commit (por ejemplo un README creado desde la web): `git pull origin main --allow-unrelated-histories` antes del push, o borrar ese README.

## 2. Activar GitHub Pages y el dominio

1. Repo → **Settings → Pages** → *Build and deployment* → Source: **GitHub Actions**.
2. *(Recomendado)* **Verificar el dominio** en la organización: github.com/organizations/Escuela-Secundaria-N17/settings/pages → *Add a domain* → `secundaria17lapoeta.edu.ar` → GitHub muestra un registro **TXT** para cargar en el DNS → *Verify*.
3. Repo → Settings → Pages → **Custom domain** → `secundaria17lapoeta.edu.ar` → **Save**.

## 3. DNS (Cloudflare)

Cloudflare → `secundaria17lapoeta.edu.ar` → **DNS → Records**.

> **Clave en Cloudflare: cada registro en "DNS only" (nube gris), no "Proxied" (nube naranja).** Con la nube naranja GitHub no puede verificar el dominio ni emitir el certificado HTTPS. Para cambiarlo: *Edit* en el registro → tocar la nube hasta que diga **DNS only** → *Save*.

| Tipo | Nombre / Host | Valor |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `escuela-secundaria-n17.github.io` |
| TXT | *(el que indique GitHub en el paso 2.2)* | *(el valor que indique)* |

- Opcional IPv6: 4 registros **AAAA** en `@` → `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`.
- Borrar otros registros A/AAAA/CNAME que ya existan para `@` o `www` (de un hosting anterior), si no, conviven y falla.
- Si hay registros **CAA** en el dominio, agregar uno que permita `letsencrypt.org` (es quien emite el certificado de GitHub Pages). Si no hay ninguno, no hace falta nada.
- **No** usar registros comodín (`*`).
- Comprobar: `dig secundaria17lapoeta.edu.ar +short` debe devolver las 4 IPs (o [dnschecker.org](https://dnschecker.org)).

Cuando Settings → Pages muestre el check de DNS en verde, activar **Enforce HTTPS** (el certificado puede tardar desde minutos hasta 24 h).

## 4. Primer deploy

1. El push del paso 1 ya lo dispara. Si no: pestaña **Actions** → **Deploy** → **Run workflow**.
2. Esperar los dos jobs en verde (`build` y `deploy`, ~2 minutos).
3. Abrir `https://secundaria17lapoeta.edu.ar`.

> Mientras el DNS propaga, `https://escuela-secundaria-n17.github.io/Landing/` se ve sin estilos: el sitio está armado para la raíz del dominio. Es normal y se resuelve solo con el dominio. Si hiciera falta mostrar algo antes de que propague, la salida rápida es renombrar el repo a `escuela-secundaria-n17.github.io` (Settings → General): se publica en la raíz de esa dirección y el dominio sigue funcionando igual.

## 5. Bibliografía desde Drive

### 5.1 Estructura de carpetas

```
Bibliografía/                         ← carpeta raíz
├── 1° año/                           ← "1° año", "1er año", "Primer año" o "1"
│   ├── Lengua y Literatura/          ← una carpeta por materia (el nombre se muestra tal cual)
│   │   ├── Programa 2026.pdf
│   │   ├── Cuadernillo de lectura.pdf
│   │   └── Unidad 1/                 ← subcarpetas: se listan como "Unidad 1 · archivo"
│   └── Matemática/
└── 4° año/
    ├── Orientación Economía/         ← opcional (4° a 6°): agrupa las materias de una orientación
    │   └── Economía/
    └── Educación Física/             ← materia común a todas las orientaciones
```

- El **tipo** sale del nombre del archivo: *Programa…*, *Cuadernillo…*, *Pautas… / Examen… / Previo…*, *Libro… / Antología… / Manual…*. Si no coincide, se muestra como *Documento*.
- Un año en el nombre (`2026`) se muestra como ciclo lectivo.
- Accesos directos de Drive: funcionan, también los que apuntan a carpetas.
- Carpetas que no son un año (ej. "Plantillas") se ignoran.

### 5.2 Compartir

Carpeta raíz → Compartir → Acceso general: **Cualquier persona con el enlace → Lector**. Todo lo que está adentro hereda el permiso, así estudiantes y familias pueden abrir los archivos.

### 5.3 API key de Google (una sola vez, ~5 minutos)

1. Entrar a [console.cloud.google.com](https://console.cloud.google.com) con una cuenta de Google de la escuela (puede ser la misma dueña de la carpeta) → aceptar términos si es la primera vez.
2. Arriba, selector de proyecto → **Proyecto nuevo** → nombre "La Poeta web" → *Crear* → seleccionarlo.
3. Menú ☰ → **APIs y servicios → Biblioteca** → buscar **Google Drive API** → **Habilitar**.
4. Menú ☰ → **APIs y servicios → Credenciales** → **+ Crear credenciales → Clave de API** → copiar la clave.
5. *Editar clave de API* → *Restricciones de API* → **Restringir clave** → marcar sólo **Google Drive API** → *Guardar*. (Restricción de aplicaciones: **Ninguna**: la usa GitHub, no el navegador.)

No hace falta cargar tarjeta ni activar facturación: la Drive API es gratuita para este uso.

> Si la cuenta de la escuela es de **Google Workspace** (ej. `@algo.edu.ar` administrada), el administrador puede tener bloqueado compartir "con cualquiera con el enlace". Si en 5.2 no aparece esa opción, hay que pedir que la habiliten o mover la carpeta a una cuenta de Gmail de la escuela.

### 5.4 Cargarla en GitHub

- Repo → **Settings → Secrets and variables → Actions → New repository secret** → nombre `GOOGLE_API_KEY` → pegar la clave → *Add secret*.
- La carpeta ya está configurada por defecto. Sólo si cambia: **Variable** `DRIVE_ROOT_FOLDER` → el link nuevo (tal cual, aunque tenga `?resourcekey=`).

Después: Actions → Deploy → **Run workflow**. En el log del paso *Bibliografía desde Drive* se ve cuántas materias y materiales encontró.

**Actualización:** cada 6 horas el deploy vuelve a leer Drive. Para ver un archivo nuevo al instante: Actions → Deploy → Run workflow.

---

## 6. Novedades desde Instagram

Hasta que esté el token, la sección muestra "Seguinos en Instagram" (no se rompe nada).

**6.1 Cuenta profesional (desde el celular, con @escpoetaortiz17):** perfil → menú ☰ → *Tipo de cuenta y herramientas* → **Cambiar a cuenta profesional** → categoría "Escuela" → **Creador** → "Ahora no" a Facebook. La cuenta tiene que ser **pública**.

**6.2 App de Meta (en la compu, ~10 minutos):**

1. Entrar a [developers.facebook.com](https://developers.facebook.com) con una cuenta de Facebook que administre la escuela → *Get started* si es la primera vez (pide verificar con el celular).
2. **My Apps → Create App**.
3. Nombre: "La Poeta web", email de contacto de la escuela → *Next*.
4. Caso de uso: **"Manage messaging & content on Instagram"** (si no aparece: **Other** → tipo **Business**).
5. Portfolio comercial: **"I don't want to connect a business portfolio yet"** → *Next* → *Create app*.
6. En el panel de la app: **Instagram → API setup with Instagram login** (si pide "Set up", aceptar).
7. Sección *Generate access tokens* → **Add account** → iniciar sesión con **@escpoetaortiz17** → aceptar permisos.
8. Al lado de la cuenta: **Generate token** → copiar el token (empieza con `IG…`, dura 60 días).

La app puede quedar en modo **desarrollo**: sólo lee la cuenta propia, así que no hace falta publicarla ni la verificación de negocio que Meta pide para eso.

**6.3 Probar el token (opcional):** pegar en el navegador, reemplazando `TOKEN`:
`https://graph.instagram.com/v26.0/me?fields=username&access_token=TOKEN` → tiene que responder `"username": "escpoetaortiz17"`.

**6.4 Cargarlo:** Repo → Settings → Secrets and variables → Actions → *New repository secret* → `INSTAGRAM_ACCESS_TOKEN` → pegar → *Add secret*. Después: Actions → Deploy → **Run workflow**.

**6.5 Renovación:** los lunes el deploy lo renueva. Para que el token renovado se guarde solo, crear también el secret opcional `GH_ADMIN_TOKEN`: GitHub → tu foto → Settings → Developer settings → **Fine-grained tokens** → *Generate new token* → Resource owner: Escuela-Secundaria-N17 → Repository: Landing → Permissions: **Secrets: Read and write** → generar y pegarlo como secret. Si no se configura, el log avisa y hay que generar un token nuevo (6.2, paso 8) antes de los 60 días.

## 7. Checklist de verificación

- [ ] `https://secundaria17lapoeta.edu.ar/` carga con el candado (HTTPS) y `www.` redirige al dominio
- [ ] `/ESJA` lleva al Google Sites de la ESJA
- [ ] Recargar en `/materias`, `/tramites`, `/agenda` → la página carga (no da 404)
- [ ] `/no-existe` → muestra "No encontramos esta página"
- [ ] `/tramites#inscripcion` abre directo la pestaña de Inscripciones
- [ ] Bibliografía muestra las materias de Drive y los archivos abren
- [ ] Novedades muestra las publicaciones (o "Seguinos" si todavía no hay token)
- [ ] Modo claro / oscuro y menú en el celular
- [ ] `/sitemap.xml` responde

## Si algo falla

| Síntoma | Causa probable | Solución |
|---|---|---|
| El job `deploy` falla con "Pages not enabled" o "Get Pages site failed" | Falta el paso 2.1 | Settings → Pages → Source: GitHub Actions, y volver a correr |
| El sitio se ve sin estilos | Se está viendo en `github.io/Landing/` | Usar el dominio (paso 3) |
| DNS "check unsuccessful" | El DNS todavía no propagó o los registros tienen un error | Revisar los A/CNAME; esperar |
| "Enforce HTTPS" deshabilitado | El certificado se está emitiendo | Esperar (hasta 24 h) |
| Drive: `403 … API key not valid` o `has not been used` | Clave mal copiada o Drive API sin habilitar | Revisar 5.3 |
| Drive: `404 File not found` | La carpeta no está compartida públicamente | Revisar 5.2; usar el link completo con `resourcekey` |
| Drive: "0 materias" | La estructura no coincide | Las carpetas de primer nivel deben llamarse "1° año", "2° año"… |
| Instagram: `Invalid OAuth access token` | Token vencido o mal copiado | Generar uno nuevo (6.2) y actualizar el secret |

Si una sincronización falla, **el deploy se corta y queda online la versión anterior**: el sitio nunca se publica a medias.


## Concursos docentes

La página `/concursos-docentes` se arma sola en cada deploy:

- **Llamados:** `scripts/sync-cge.mjs` busca en cge.entrerios.gov.ar las publicaciones cuyo título nombra a la escuela (CUE 300-1754, o "N° 17" + "Ortiz"). No hay que configurar nada. En el log del paso *Concursos docentes desde el CGE* se ve cuántos encontró.
- **Documentos para descargar** (opcional):
  1. En Drive, creá una carpeta "Concursos docentes" con los archivos (formulario unificado, instructivos…). Compartila como *Cualquier persona con el enlace → Lector*.
  2. GitHub → Settings → Secrets and variables → Actions → pestaña **Variables** → New variable: `DRIVE_CONCURSOS_FOLDER` = link de esa carpeta.
  3. Los Google Docs se descargan como Word (para completarlos), las Planillas como Excel y los PDF tal cual. Los links fijos (credencial de puntaje, SAGE) están en `src/content/concursos.ts`.
