# Pixabay Challenge Viewer

A single-page frontend that searches the [Pixabay API](https://pixabay.com/api/docs/) for **photos** or **videos**, and runs four lab challenges: **Rocket Launch**, **Basketball**, **Forest**, and **Road Forest**.

Choose **Type** (Photo or Video) for the search bar, then search. The four challenge buttons always use their own fixed Pixabay parameters and show results on this same page.

## Prerequisites

- A modern browser (Chrome, Edge, or Firefox).
- A **Pixabay API key**. Create a free Pixabay account, then copy your key from the [Pixabay API docs](https://pixabay.com/api/docs/) (you must be logged in to see it).

**API key note:** keep the key in `config.js` on your computer. Do not commit or push `config.js` to GitHub. `.gitignore` lists that file so Git skips it. Use `config.sample.js` as the template.

## How to run locally

1. Copy the sample config:

   ```powershell
   Copy-Item config.sample.js config.js
   ```

2. Open `config.js` and replace `YOUR_PIXABAY_API_KEY_HERE` with your Pixabay key:

   ```js
   window.PIXABAY_API_KEY = "your_real_key_here";
   ```

3. Open `index.html` in a browser (double-click it, or use Live Server).

Search should return six photos or videos. If you see “Missing API key”, `config.js` is missing or still has the placeholder.

## If `config.js` was already pushed to GitHub

1. Make sure `.gitignore` contains `config.js`.
2. Remove it from Git **without deleting your local copy**:

   ```powershell
   git rm --cached config.js
   git add .gitignore README.md
   git commit -m "Stop tracking config.js and keep the API key local"
   git push
   ```

3. The file disappears from the **latest** commit, but older commits can still contain the key. **Rotate the key** on Pixabay (generate a new one), put the new key only in local `config.js`, and use the new key on Netlify if you deploy.

For live hosting, upload the folder (including local `config.js`) with [Netlify Drop](https://app.netlify.com/drop). Do not put the key in the GitHub repo.
