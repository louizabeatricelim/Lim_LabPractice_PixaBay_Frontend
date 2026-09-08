# Pixabay Challenge Viewer

A single-page site (plain HTML, CSS, and JavaScript) that searches the [Pixabay API](https://pixabay.com/api/docs/) for photos or videos. Visitors can type any search term and choose Photo or Video, or click one of four lab challenges: **Rocket Launch**, **Basketball**, **Forest**, and **Road Forest**. Results load on the same page, with a loading state and an error message if a request fails.

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

`config.js` stays on your machine only. GitHub should list `config.sample.js`, not `config.js`.

## Host on Netlify (auto-deploy from GitHub)

GitHub Pages cannot be used for this lab. Netlify can inject the key at build time.

1. Push this repo to GitHub (without `config.js`).
2. On [Netlify](https://app.netlify.com/), **Add new site → Import an existing project → GitHub**, then choose `Lim_LabPractice_PixaBay_Frontend`.
3. Build settings:
   - **Build command:** `printf 'window.PIXABAY_API_KEY = "%s";\n' "$PIXABAY_API_KEY" > config.js`
   - **Publish directory:** `.`
4. **Site configuration → Environment variables → Add a variable**
   - Key: `PIXABAY_API_KEY`
   - Value: your Pixabay key
5. Deploy. Netlify rebuilds on every push to `main`.

The same build command is in `netlify.toml`.

After the site is live, treat the key as compromised: generate a **new** Pixabay key, update the Netlify variable, and stop using the old key.

## Project files on GitHub

| File | Include on GitHub? |
| --- | --- |
| `index.html`, `styles.css`, `app.js` | Yes |
| `config.sample.js` | Yes (placeholder only) |
| `README.md`, `.gitignore`, `netlify.toml` | Yes |
| `config.js` | **No** |
