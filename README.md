# Pixabay Challenge Viewer

A single-page site built with plain HTML, CSS, and JavaScript. Visitors can type any search term and choose Photo or Video, or click one of four challenge buttons: **Rocket Launch**, **Basketball**, **Forest**, and **Road Forest**. The page uses `fetch` to call the [Pixabay API](https://pixabay.com/api/docs/) and shows photos or videos on the same page. A loading indicator appears while a request runs, and a readable error message appears if the request fails.

The search bar uses the Photo/Video dropdown. The challenge buttons use the fixed parameters from the previous lab (Rocket Launch, Basketball, and Forest are videos; Road Forest is a photo).

## Prerequisites

- A modern browser
- A Pixabay API key from the [Pixabay API docs](https://pixabay.com/api/docs/) (log in to see it)

**API key note:** keep the key in `config.js` on your computer. Do not commit or push `config.js` to GitHub. `.gitignore` lists that file so Git skips it. Use `config.sample.js` as the template.

**API key tradeoff:** Even with `config.js` kept out of GitHub, once the site is deployed and JavaScript calls Pixabay directly from the browser, anyone who opens developer tools or views the network request can see the API key. Keeping `config.js` out of the repository keeps the key out of GitHub history, which is a real and worthwhile habit, but it does not hide the key from someone using the live site.

## How to run locally

1. Copy the sample config:

   ```powershell
   Copy-Item config.sample.js config.js
   ```

2. Open `config.js` and replace `YOUR_PIXABAY_API_KEY_HERE` with your Pixabay key.

3. Open `index.html` in a browser.

## Hosting on Render

GitHub Pages cannot be used for this lab. This repo is connected to [Render](https://dashboard.render.com/) as a static site so it deploys on each push.

- **Build command:** `printf 'window.PIXABAY_API_KEY = "%s";\n' "$PIXABAY_API_KEY" > config.js`
- **Publish directory:** `.`
- **Environment variable:** `PIXABAY_API_KEY` (and `SKIP_INSTALL_DEPS=true`)

After the site is live, treat the key as compromised: generate a new Pixabay key, update the Render variable, and stop using the old key.
