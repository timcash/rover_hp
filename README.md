# Welcome.
This README is a great way to communicate about this project.
Feel free to add questions or comments to help it improve.

![video](vid.gif)

# Bonus repo
In 2020 I built this demo to help some folks on discord get started with hypercore. It shows a few nice patterns around async publishing and subscriptions. Additionaly, it attemps to clear up a few questions that come up around keys. Running the tests it looks like it is time for an update. I'll try to get to that soon.
https://github.com/timcash/hyperspace-demo
![hypercore demo](https://raw.githubusercontent.com/timcash/hyperspace-demo/master/demo.png)

# Background
For this project I took a breadth-first approch to sharing techniques and some code. Less tooling overall is ideal and here and I try to show a balance to get some example demostrated quickly. Looking at the hypercore repos the `brittle` library was popular so I took at shot at integrating it. Two other key components are `playwright` for UI and a small library/template to help scaffold projects called `small_http` see https://github.com/timcash/small_http

Otherwise, no external runtime libs, just node:core and some vanilla JS for the frontend.

# Always learning
Help me learn, I am always up to adapt and try new patterns. Thank you for taking the time review the work.

# Install
```sh
npm install
```
# Test
> I was not able to get the coverge reporting working just right. It is still reporting on the "demo" http server.
use `test:wrap` or `test:html` to run smaller components.
```json
"scripts": {
  "start": "nodemon src/http.start.js",
  "test": "standard & brittle test/*.test.js",
  "test:wrap": "standard & brittle test/rover_wrap.test.js",
  "test:html": "standard & brittle test/html.test.js",
  "fix": "standard --fix"
}
```
# If you want to see the browser interaction
uncomment the following lines in the `test/html.test.js` file
```js
const browser = await chromium.launch({
  // headless: false,
  // slowMo: 1000,
  // devtools: true
})
```
# Standards
```sh
npm run fix
```
# Run
To run just the webserver and see the app
```sh
npm start
```
# Reqs
## Part 1 Library
1. Getting all information about the latest Rover image (the /termrover/latest endpoint).
> see: src/rover_wrap/getImageById() | getImageById(:number)

1. Generating an iterator over all Rover images/metadata, ordered from earliest to latest (smaller indexes on the /termrover/:index endpoint are considered earlier). This can be a Node.js stream, an async iterator, or a similar abstraction, but it shouldn't synchronously load all images.
> see: src/rover_wrap/iterateImageAssending(start=0)

## Part 2 Website
The website must consume the module above, and support two modes of operation:

Display a slideshow that periodically cycles between images
Display a single image
> see http://localhost:3000/ after starting with `npm start` or `npm run test:html`

When a user visits the default URL (/), they should see a slideshow. If they visit a specific index (/:index), they should see a single image. In slideshow-mode, a user should be able to choose how rapidly the slideshow progresses with a query option, speed, in milliseconds.
> see http://localhost:3000/?ms=3000 or http://localhost:3000/?ms=100

In both modes, the site should display two pieces of metadata when images are hovered over:

The image's sol (inside it's metadata field)
The earth_date when the image was acquired (also inside metadata)
> see the html.test.js test
```js
const image = await page.locator('#_1')
await image.hover()
const element = await page.locator('#metadata')
// verify element has the data and sol
const text = await element.innerHTML()
t.is(text.includes('Sol: 0'), true)
t.is(text.includes('Earth Date: 2021-02-18'), true)

// mouse to top left of the page
await page.mouse.move(0, 0)
// verify element has style display: none
const style = await element.getAttribute('style')
t.is(style.includes('display: none'), true)
```

Please ensure that the website is also properly tested (using a UI testing library of your choosing).
> using playwrite: UI tests could use more work, this should show a foundation for building on.
