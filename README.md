# Pixabay Challenge Viewer

A single-page site built with plain HTML, CSS, and JavaScript. Visitors can type a search term and choose **Photo** or **Video**, or click **Rocket Launch**, **Basketball**, **Forest**, or **Road Forest**. The page calls the [Pixabay API](https://pixabay.com/api/docs/) with `fetch` and shows the results on the same page, including a loading indicator and an error message if a request fails.

## Prerequisites

- A modern browser
- A Pixabay API key from the [Pixabay API docs](https://pixabay.com/api/docs/) (you must be logged in to see it)

**API key note:** keep the key in `config.js` on your computer. Do not commit or push `config.js` to GitHub. `.gitignore` lists that file so Git skips it. Use `config.sample.js` as the template.

## How to run locally

1. Copy the sample config:

   ```powershell
   Copy-Item config.sample.js config.js
   ```

2. Open `config.js` and replace `YOUR_PIXABAY_API_KEY_HERE` with your Pixabay key.

3. Open `index.html` in a browser.

## Hosting on Render

This lab cannot use GitHub Pages. On [Render](https://dashboard.render.com/), connect this GitHub repo as a **Static Site**.

- **Build command:** `printf 'window.PIXABAY_API_KEY = "%s";\n' "$PIXABAY_API_KEY" > config.js`
- **Publish directory:** `.`
- **Environment variable:** `PIXABAY_API_KEY` = your key  
  Also set `SKIP_INSTALL_DEPS` to `true`.

Render rebuilds on each push. After the site is live, rotate your Pixabay key and update the Render variable.
