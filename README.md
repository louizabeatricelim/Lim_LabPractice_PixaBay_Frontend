# Pixabay Challenge Viewer

A single-page site (plain HTML, CSS, and JavaScript) that searches the [Pixabay API](https://pixabay.com/api/docs/) for photos or videos. Use the **Type** dropdown (Photo or Video), then search or click **Rocket Launch**, **Basketball**, **Forest**, or **Road Forest**. Search and challenges both follow Type. Results stay on this page, with a loading indicator and an error message if a request fails.

## Prerequisites

- A modern browser
- A Pixabay API key from the [Pixabay API docs](https://pixabay.com/api/docs/) (log in to see it)

**API key note:** keep the key in `config.js` on your computer. Do not commit or push `config.js` to GitHub. `.gitignore` lists that file so Git skips it. Use `config.sample.js` as the template.

## How to run locally

1. Copy the sample file:

   ```powershell
   Copy-Item config.sample.js config.js
   ```

2. Open `config.js` and replace the placeholder with your key:

   ```js
   window.PIXABAY_API_KEY = "YOUR_PIXABAY_API_KEY_HERE";
   ```

3. Open `index.html` in a browser.

## Host on Render

GitHub Pages cannot be used for this lab. Render injects the key at build time.

1. Push this repo to GitHub (without `config.js`).
2. On [Render](https://dashboard.render.com/), **New → Static Site**, connect `Lim_LabPractice_PixaBay_Frontend`.
3. Settings:
   - **Build Command:** `printf 'window.PIXABAY_API_KEY = "%s";\n' "$PIXABAY_API_KEY" > config.js`
   - **Publish Directory:** `.`
4. **Environment**
   - `PIXABAY_API_KEY` = your Pixabay key
   - `SKIP_INSTALL_DEPS` = `true`
5. Save and deploy. Render rebuilds on every push to `main`.

The same build command is in `render.yaml`.

After the site is live, treat the key as compromised: generate a **new** Pixabay key, update the Render variable, and stop using the old key.

## Project files on GitHub

| File | On GitHub? |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | Yes |
| `config.sample.js` | Yes (placeholder only) |
| `README.md`, `.gitignore`, `render.yaml` | Yes |
| `config.js` | **No** |
| `netlify.toml` | No (this lab uses Render) |
