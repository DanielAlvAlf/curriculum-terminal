# CV Retro OS

CV de **Daniel Álvarez Alfonso** como web estática que imita el escritorio de **Windows 95** y de **Ubuntu 10.04**. Cada sección es una ventana: la terminal, el Bloc de notas, WinZip, Excel… Se puede cambiar de tema, suena como un ordenador antiguo y se puede guardar como un PDF sobrio.

Está hecho a mano con HTML, CSS y un poco de JavaScript, sin frameworks, sin librerías y sin paso de compilación. El código fuente también forma parte del CV.

## Demo

https://danielalvalf.github.io/curriculum-terminal/

## Estructura de archivos

```
index.html     todo el contenido del CV
css/base.css   reset, layout, componentes, móvil e impresión
css/win95.css  tema Windows 95
css/ubuntu.css tema Ubuntu 10.04 (Lucid Lynx)
js/main.js     tema, menús, sonidos, efecto de tecleo y reloj
```

Para cambiar el contenido del CV solo hay que editar `index.html`.

## Decisiones técnicas

- **HTML semántico.** El contenido está escrito en `index.html` con `<section>`, `<article>`, `<dl>`, `<table>` y `<time>`. Así se entiende sin estilos y lo pueden leer bien los lectores de pantalla y los buscadores.
- **Mejora progresiva.** Sin JavaScript el CV se ve entero (tema Windows 95), se navega y se imprime; el JS solo añade extras. Así, si el script no carga, no se pierde ningún contenido.
- **`<details>` para los menús.** Abren y cierran sin JS y se manejan con teclado sin código extra. El atributo `name` hace que solo haya uno abierto a la vez.
- **Temas con custom properties y `data-skin`.** Cada tema es un CSS con su paleta en `:root[data-skin="…"]`, y cambiar de tema es cambiar un atributo de `<html>`. Los títulos de ventana y el prompt de cada tema están en el HTML, y el CSS muestra los que tocan.
- **Animaciones de scroll con CSS** (`animation-timeline: view()`). No hace falta JS. Si el navegador no las soporta, las ventanas se ven sin animación, nunca ocultas. Con `prefers-reduced-motion` no hay animaciones ni efecto de tecleo.
- **Sonidos con la Web Audio API.** Se generan en el momento, sin archivos de audio. El audio arranca con el primer clic o tecla, como piden los navegadores, y así no salen avisos en la consola.
- **Hoja de impresión A4.** "Guardar como PDF" quita la decoración y deja un CV de 2 páginas con las URLs en versión corta (atributo `data-print`).

## Cómo verlo en local

```bash
python3 -m http.server
```

Y abre http://localhost:8000. También funciona abriendo `index.html` directamente, pero con el servidor se parece más a GitHub Pages.

## Cómo cambiar de tema

Usa **Cambiar tema**: está en el menú **Inicio** en Windows 95 y en el menú **Sistema** en Ubuntu. El tema elegido se guarda en el navegador (`localStorage`). El tema por defecto es el del atributo `data-skin` de `<html>` en `index.html`.
