# Install
```sh
npm install
```
# Test
```sh
npm test
npm run test-watch
```
# Standards
```sh
npm run fix
```

# Part 1 Library
1. Getting all information about the latest Rover image (the /termrover/latest endpoint).
> see getImageById() vs getImageById(:number)

1. Generating an iterator over all Rover images/metadata, ordered from earliest to latest (smaller indexes on the /termrover/:index endpoint are considered earlier). This can be a Node.js stream, an async iterator, or a similar abstraction, but it shouldn't synchronously load all images.
> see iterateImageAssending()

# Part 2 Website
The website must consume the module above, and support two modes of operation:

Display a slideshow that periodically cycles between images
Display a single image
> complete

When a user visits the default URL (/), they should see a slideshow. If they visit a specific index (/:index), they should see a single image. In slideshow-mode, a user should be able to choose how rapidly the slideshow progresses with a query option, speed, in milliseconds.
> complete

In both modes, the site should display two pieces of metadata when images are hovered over:

The image's sol (inside it's metadata field)
The earth_date when the image was acquired (also inside metadata)
> complete

Please ensure that the website is also properly tested (using a UI testing library of your choosing).
> complete: using playwrite. UI tests could use more work just trying to timebox.