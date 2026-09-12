# Vesper Launcher website v3

Static GitHub Pages site for Vesper Launcher.

## Files
- `index.html` — landing page
- `privacy.html` — privacy policy
- `styles.css` — responsive dark/winter visual system
- `script.js` — irregular animated starfield, reveal animations, parallax and release download lookup
- `assets/vesper-logo-full.png` — full supplied lockup
- `assets/vesper-mark.png` — symbol-focused crop of the supplied logo
- `assets/vesper-word.png` — wordmark-focused crop

## Download behavior
The download buttons query the latest public GitHub release from `db-105/vesper-launcher-releases` and link to the first Windows `.exe` asset. If no public release exists yet, the buttons intentionally show `Public release coming soon` and cannot download an unapproved build.

## Deployment
Copy these files into the root of `db-105/vesper-launcher-site` and commit to the branch used by GitHub Pages.
