![video](vid.gif)

# Background
For this project I took a breadth-first approch to sharing techniques and some code. Less tooling overall is ideal, here I try to show a balance to get some examples demostrated quickly. Two other key components are `playwright` for UI and a small library/template to help scaffold projects called `small_http` see https://github.com/timcash/small_http

Otherwise, no external runtime libs, just node:core and some vanilla JS for the frontend.


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
