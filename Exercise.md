Hypercore Coding Exercise

Under the hood, most of our peer-to-peer tech is currently written in Javascript, using Node.js. Since you'll be joining a tiny team of JS devs, we've put together this task to get a better feel for how you design and build tiny JS programs from the ground up.

The Task


The Perseverance rover landed earlier this year, and since then has been uploading amazing images from the surface of Mars. We want to explore these images, either from the CLI, or through a small website.

For this task, we ask that you write two components, the second building on the first.

There are two different ways to approach this, depending on which skills and technologies you're most comfortable with (we only expect you to do one!). Both approaches share one component in common: a wrapper module that exports an easy-to-use interface for querying the Rover API:

Frontend: If you'd like to show us how you design/build websites and Web-compatible modules, you can take a website-focused path.
General Node.js: If you don't like making websites, and would rather write Node.js modules and a CLI tool, you can take a CLI-focused path.


Please submit this task by publishing your work to GitHub (it can be private repos if preferred). These is no need to publish the modules to NPM.

There are multiple ways to approach this task, but regardless of which one you choose, implement your solution with the same rigor and best practices that you would normally apply.

(And if you're curious, NASA has a great assortment of APIs here, to peruse at your leisure). 



The Rover API


At hiring.hypercore-protocol.org/termrover, we've created an HTTP(S) API that lets you get images from Perseverance's "Front Left Hazard Avoidance Camera". NASA publishes batches of images once per "sol" (Martian day) — our API lets you query for these images by index, as though they were in one large array.


To make it as easy as possible to use these images in websites, and from the CLI, our API returns the images as both:

Base64-encoded strings (for embedded in img tags)
ASCII art (for displaying in the terminal)


The API is structured as follows:

/termrover returns a JSON object of the form{ key, numImages }, where:
 key is a Hypercore key (see "Extra Credit (Without Credit)") 
numImages is the number of available images.
/termrover/:index gets the indexth image, and returns an object of the form { metadata, images }, where:
metadata is image metadata forwarded directly from the NASA API. Explore this to your liking, but it's not used in the tasks below.
images contains two images encoded as JS strings:
base64 is a Base64 URI that can be embedded in an img tag
ascii is a 50x50 ASCII art representation
/termrover/latest returns the latest image, and the response has the same form as the /termrover/:index response


Wrapper Module


The first module should be a small wrapper around the Rover API that exposes a few methods for dealing with Rover images. There should be methods for:

Getting all information about the latest Rover image (the /termrover/latest endpoint).
Generating an iterator over all Rover images/metadata, ordered from earliest to latest (smaller indexes on the /termrover/:index endpoint are considered earlier). This can be a Node.js stream, an async iterator, or a similar abstraction, but it shouldn't synchronously load all images.

In both cases, the JSON response should be forwarded with minimal modifications — no need to extract out pieces of the response.

Once this module is tested and documented, you should do either the CLI Task, or the Frontend Task, as described below.



CLI Task


If you'd prefer to complete this exercise entirely within Node.js, go ahead and use the wrapper module in a CLI tool that supports the following two modes of operation, both of which will render images as ASCII art in the terminal. An ASCII-fied version of each Rover image is available at response.images.ascii in the API's responses: 

"Display image X": Display the image with ID X
"Display a slideshow with transition time X": Start a slideshow that displays all images, with an X millisecond pause between images.

The CLI tool should feel "production-ready": it should handle positional arguments/options correctly, provide help output, etc.



Frontend Task


If you're more experienced with frontend development, the next step is to make a small website that lets users view and explore images returned by the wrapper module above. If you're taking this path, we assume you want to show off your Web skills, so feel free to design/style it as you'd like, but keep it simple.


The website must consume the module above, and support two modes of operation:

Display a slideshow that periodically cycles between images
Display a single image


When a user visits the default URL (/), they should see a slideshow. If they visit a specific index (/:index), they should see a single image. In slideshow-mode, a user should be able to choose how rapidly the slideshow progresses with a query option, speed, in milliseconds.



In both modes, the site should display two pieces of metadata when images are hovered over:

The image's sol (inside it's metadata field)
The earth_date when the image was acquired (also inside metadata)

Please ensure that the website is also properly tested (using a UI testing library of your choosing).



Submitting


Thanks for taking the time to complete this exercise!

Once you've finished, please upload your code to a repository on GitHub. The repository can be private, but make sure that GitHub user mafintosh has access.

After you've uploaded the code, send Mathias an email with a link to the repo at mathiasbuus@gmail.com, and we'll get back to you ASAP.



Extra Credit (Without Credit)


If you're in the mood to play around, we're also publishing all the images in a Hypercore, the key of which can be found in the /termrover API response. You can make use of this Hypercore if you'd like, but don't feel any pressure to (truly) — this task is not about demonstrating familiarity with Hypercore, so we won't be assessing that.

If you're building on the stack elsewhere, for example, and might be interested in some Rover images in a Hypercore, then there you go!

