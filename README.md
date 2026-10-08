# Chhavi — Control Engineering Portfolio

An interactive, no-build portfolio with a procedural Three.js world as its navigation layer. Open **Enter the Controlverse** or **System Map**, then drag to orbit, scroll to change distance, select a beacon to fly into that section, and find five loose signal fragments. The world tracks visited regions and recovered fragments in local browser storage. The intro runs once per browser session; section changes do not replay it.

## Add Chhavi’s images and details

- Replace bracketed profile, role, date, publication, and project text with verified information.
- The supplied `images/SkidSteer_cover.png` and `images/RCWS_cover.png` are linked directly to the matching research and project cards and detail pages. The Home bio card uses `images/nitj_logo.png`; add your portrait as `images/chhavi-portrait.jpg`. The remaining sample cards link to the image paths listed in [`images/README.md`](images/README.md); missing images are hidden without placeholder frames.
- The individual research pages live in `research/`; project pages live in `projects/`. Update the matching archive card link when you rename a page.
- Add Chhavi’s hero portrait as `images/chhavi-portrait.jpg`; it will appear as a softly desaturated, glass-tinted full-bleed backdrop on the Home page.
- The Bio section includes the B.Tech ICE 2022–26 card with the NIT Jalandhar logo.
- Edit the scalable interest word collage in `index.html` and `research.html`; font-size classes let key areas carry more visual weight.
- Fill each project and research detail page with concise problem/question, approach, result/finding, and tools. Replace the sample `#` links with the paper, repository, DOI, or demo URL.
- Fill in the milestone entries in `experience.html`; each role or education stop expands to reveal field notes.
- Add the resume PDF at the project root as `resume.pdf`, or change the Resume link in `index.html` to its new path.
- Social icons in every footer link to LinkedIn, GitHub, ORCID, and `mailto:chhavi.akan@gmail.com`.
- Add painting images and Bharatanatyam videos to `media/`. The hobbies page offers local file previews, but the browser does not upload or publish those files. To publish videos, add `<source>` elements to the video players; add painting files as image elements in the gallery.

## Run and publish

Three.js is loaded from the jsDelivr CDN at version `0.186.0`, so preview the site through an HTTP server and keep the network available. A static host such as GitHub Pages or Netlify serves it without a build step. The Three.js installation guide notes that browsers restrict important module features when a page is opened directly as a `file://` URL: [official installation guide](https://threejs.org/manual/pages/installation.html).

If WebGL or the CDN is unavailable, the System Map falls back to its ordinary text navigation links. The site also respects the reduced-motion preference for CSS motion and page transitions.

## Editing

HTML, CSS, and JavaScript files are formatted with Prettier using two-space indentation. The site has no build step; edit the source files directly in VS Code and refresh the local HTTP preview.
