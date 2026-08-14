# Business Template

A reusable static template you can keep on your hard drive, copy into new projects, and open quickly for fast builds.

## What’s in the folder

- `index.html` for the page structure
- `gallery.html` for the separate category gallery page
- `styles.css` for the page look and colors
- `main.js` for the color picker behavior
- `process-images.js` for the Sharp image pipeline

## Image folders

- Put source image folders inside `raw-images/`
- Process one gallery at a time by pointing the script at a single source folder
- The script writes processed WebP files into `staging/`
- Staging is the handoff point; after that you build or rename the gallery by hand
- You choose the output gallery name with `--name` if you want to override the folder name

## Use it locally

Open `index.html` in a browser, or copy the folder wherever you need a fast starting point.

Open `gallery.html` for the separate gallery view with category sections.

This folder is the saved template. Copy the whole folder when you want another site and keep this one unchanged.

## Process images

Run `npm run process:gallery -- --source raw-images/gallery-01` to resize images to 800x800, convert them to WebP, and rename them in sequential order based on the source folder name.

Example with a custom output name:

`npm run process:gallery -- --source raw-images/gallery-01 --name kitchen-remodel`

After staging, use the files yourself to build the separate gallery page and category structure.

## Fill it in

- Replace the placeholder text with the business name and details
- Pick new colors with the four color inputs in the header
- Update the links, phone number, email, and section copy
- Put your staged image folders into category groups and drop the final image paths into the gallery cards
