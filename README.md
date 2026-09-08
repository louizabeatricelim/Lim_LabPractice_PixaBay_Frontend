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

This lab uses [Netlify Drop](https://app.netlify.com/drop) for free static hosting:

1. Keep a local copy of `config.js` with your real key (still never push that file to GitHub).
2. Drag the whole project folder (including `config.js`) onto Netlify Drop.
3. Netlify gives you a public URL. Open it and test search plus each challenge button.

Because the key ships with the deployed files, remember the tradeoff above.

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
