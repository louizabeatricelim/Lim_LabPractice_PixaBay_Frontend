# Pixabay Challenge Viewer

A single-page site (plain HTML, CSS, and JavaScript) that searches the [Pixabay API](https://pixabay.com/api/docs/) for photos or videos, and runs four fixed lab challenges: **Rocket Launch**, **Basketball**, **Forest**, and **Road Forest**.

## Local setup

1. Copy the sample config and add your Pixabay API key:

   ```bash
   cp config.sample.js config.js
   ```

   On Windows (PowerShell):

   ```powershell
   Copy-Item config.sample.js config.js
   ```

2. Open `config.js` and replace `YOUR_PIXABAY_API_KEY_HERE` with your key from [Pixabay API docs](https://pixabay.com/api/docs/) (log in to see it).

3. Open `index.html` in a browser, or serve the folder with any static server.

`config.js` is listed in `.gitignore` so it is never committed.

## API key tradeoff

Keeping `config.js` out of GitHub protects your key from ending up in repository history. That is a good habit.

It does **not** hide the key from people using your live site. Because this page calls Pixabay directly from the browser, anyone can open DevTools or inspect the network request and see the key. For a school lab this is expected; treat the key as semi-public once the site is deployed, and rotate it on Pixabay if it was ever committed in an older repo.

## Push to GitHub with SSH

### 1. Set up an SSH key (if you do not have one yet)

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

Press Enter to accept the default path. Add an optional passphrase if you want.

Start the agent and add your key (GitHub’s Windows / macOS docs cover OS-specific details):

```bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
```

Copy the **public** key (`~/.ssh/id_ed25519.pub`) and add it under GitHub → **Settings** → **SSH and GPG keys** → **New SSH key**.

Test the connection:

```bash
ssh -T git@github.com
```

### 2. Create a GitHub repository

On GitHub, create a new empty repository (no README if you already have one locally).

### 3. Initialize, commit, and push with SSH

From this project folder:

```bash
git init
git add .
git status
```

Confirm `config.js` is **not** staged. Then:

```bash
git commit -m "Add Pixabay Challenge Viewer single-page site"
git branch -M main
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Use SSH (`git@github.com:...`), not HTTPS.

## Host live on Netlify (free)

This is a static site (`index.html`, `styles.css`, `app.js`). No Node build is required. Use **Netlify Drop** for class: it uploads your local folder, including `config.js`, which Git never commits.

### Before you deploy

1. Copy the sample config if you have not already:

   ```powershell
   Copy-Item config.sample.js config.js
   ```

2. Open `config.js` and paste your real Pixabay key:

   ```js
   window.PIXABAY_API_KEY = "paste_your_key_here";
   ```

3. Confirm these files are in the project folder:

   - `index.html`
   - `styles.css`
   - `app.js`
   - `config.js` (must be present on Netlify or search will fail)

Do **not** push `config.js` to GitHub. Deploy it only through Netlify.

### Method A — Netlify Drop (recommended)

1. Create a free account at [Netlify](https://www.netlify.com/) (Sign up with GitHub, email, or Google).
2. Open [Netlify Drop](https://app.netlify.com/drop).
3. Drag the **whole project folder** onto the drop zone. Include `config.js`. You can also zip the folder and drop the zip.
4. Wait until Netlify finishes uploading. It shows a live URL such as `https://random-name-123456.netlify.app`.
5. Open that URL. Search for a photo or video, switch the result view, and click each challenge button.

If search says the API key is missing, `config.js` was not in the upload. Add the file locally and drag the folder onto Drop again (or use **Deploys → Deploy manually** on the site).

### Optional: rename the site URL

1. In Netlify, open the site → **Domain management** (or **Site configuration → Domain management**).
2. Choose **Options → Edit site name**.
3. Pick a unique name, for example `familyname-pixabay-viewer`.
4. The public URL becomes `https://your-site-name.netlify.app`.

### Method B — Connect a GitHub repo (optional)

Use this if you want Netlify to redeploy whenever you push to GitHub.

`config.js` is gitignored, so a plain Git deploy will **not** include your key. Generate it at build time from a Netlify environment variable:

1. Push the project to GitHub **without** `config.js`.
2. In Netlify: **Add new site → Import an existing project → GitHub**. Authorize Netlify and pick the repo.
3. Build settings:
   - **Build command:** `echo window.PIXABAY_API_KEY="%PIXABAY_API_KEY%"; > config.js`  
     On Netlify’s Linux builders use:

     ```bash
     printf 'window.PIXABAY_API_KEY = "%s";\n' "$PIXABAY_API_KEY" > config.js
     ```
   - **Publish directory:** `.` (leave empty / site root)
4. **Site configuration → Environment variables → Add a variable**
   - Key: `PIXABAY_API_KEY`
   - Value: your Pixabay key
5. Deploy. Confirm search and the challenge buttons work on the live URL.

### Quick checks after deploy

- The homepage title **Pixabay Challenge Viewer** loads.
- Search returns photos or videos.
- The six result views (Spotlight, Pair, Gallery, Quad, Mosaic, Filmstrip) change the layout.
- Rocket Launch, Basketball, Forest, and Road Forest each return six results.
- If the status line says the key is missing, `config.js` was not generated or not uploaded.

Because the key is in the public site (Drop) or injected at build time (Git), treat it as semi-public. See **API key tradeoff** above.

## Challenge presets

| Button         | Type  | Main parameters |
| -------------- | ----- | --------------- |
| Rocket Launch  | Video | `q=Rocket Launch`, `category=science`, `editors_choice=true`, `per_page=3` |
| Basketball     | Video | `q=Basketball`, `category=sports`, `order=latest`, `per_page=3` |
| Forest         | Video | `q=Forest`, `category=background`, `editors_choice=true`, `order=latest`, `per_page=3` |
| Road Forest    | Photo | `q=Road Forest`, `image_type=photo`, `category=nature`, `editors_choice=true`, `per_page=3` |

## Project files

| File               | Purpose                                      |
| ------------------ | -------------------------------------------- |
| `index.html`       | Page structure                               |
| `styles.css`       | Layout and styling                           |
| `app.js`           | Search, challenges, loading and error UI     |
| `config.sample.js` | Placeholder for clones                       |
| `config.js`        | Your real key (local / deploy only; ignored) |
| `.gitignore`       | Ignores `config.js`                          |
