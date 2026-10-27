# Riddhix Technology website

Static site (HTML, CSS, JavaScript + three.js for the 3D hero). No build step needed.

## Put it online with GitHub Pages
1. Create a new repository on GitHub, e.g. `riddhix-website` (public).
2. Upload everything in this folder (index.html, css/, js/, assets/, .nojekyll) to the repository root.
3. Repository Settings -> Pages -> Source: "Deploy from a branch" -> Branch: `main`, folder `/ (root)` -> Save.
4. After a minute the site is live at `https://<your-username>.github.io/riddhix-website/`.

Custom domain: Settings -> Pages -> Custom domain, then add a CNAME record at your domain provider pointing to `<your-username>.github.io`.

## Things to edit
- `js/main.js` line 2: `CONFIG.email` - your real enquiry email (the contact form opens the visitor's email app).
- `index.html`: service text, sector list and footer details.
- `assets/`: logo files cropped from your logo.
- Colors are CSS variables at the top of `css/style.css`.
