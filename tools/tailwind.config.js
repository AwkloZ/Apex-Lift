// Builds tailwind.css (the app's design styles) so no outside script is needed.
// Rebuild after changing classes:  npx tailwindcss@3.4.17 -c tools/tailwind.config.js -i tools/tailwind.in.css -o tailwind.css --minify
module.exports = { content: ['./index.html', './app.js'] };
