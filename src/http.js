// ========================================================
// SMALL_HTTP
// ========================================================
// author: timcash
// bootrap a small_http server
// built with node.js and core libs
// based on streams
// direct access to headers, mimetype and cookies
// import startHttp(:port), stopHttp() to get started
// EASY to modify and extend!

// ========================================================
// IMPORTS
// ========================================================
import http from 'node:http'
import { extname, join, dirname } from 'node:path'
import { createReadStream } from 'node:fs'
import { fileURLToPath } from 'node:url'
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

let server

const extentionMap = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.ico': 'image/x-icon'
}

// ===================================================
// HEADER HANDLING
// ===================================================
function handleHeaders (res, filePath) {
  const extention = extname(filePath)
  if (!extentionMap[extention]) {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    return
  }
  res.writeHead(200, {
    'Content-Type': extentionMap[extention]
  })
}

// ===================================================
//  RESPONSE FILE STREAM
// ===================================================
// inspect or modify chunks of the response stream
function streamFile (req, res, relativefilePath) {
  const reader = createReadStream(relativefilePath)
  reader.on('open', () => {
    handleHeaders(res, relativefilePath)
  })
  reader.on('data', function (chunk) {
    res.write(chunk)
  })
  reader.on('close', function () {
    res.end()
  })
  reader.on('error', (err) => {
    if (err.code === 'ENOENT') {
      // no logging for non existing files
    } else {
      console.error(err)
    }
    nothing(req, res)
  })
}

// ===================================================
//  RESPONSE TEMPLATES
// ===================================================
function nothing (req, res) {
  const STATUS = 404
  console.log(req.method, req.url, STATUS)
  res.writeHead(STATUS, { 'Content-Type': 'text/plain' })
  res.end('404 Not Found')
}

function methodNotAllowed (req, res) {
  const STATUS = 405
  console.log(req.method, req.url, STATUS)
  res.writeHead(STATUS, { 'Content-Type': 'text/plain' })
  res.end('405 Method Not Allowed')
}

// ===================================================
//  REQUEST HANDLER
// ===================================================
const allowedMethods = ['GET']
function handleRequest (req, res) {
  if (!allowedMethods.includes(req.method)) {
    methodNotAllowed(res)
    return
  }

  const pathname = new URL(req.url, 'http://localhost').pathname

  let file = pathname
  if (file === '/') {
    file = '/public/index.html'
  }

  // regex for /imageIdx
  const imageIdx = /\/(\d+)$/
  const match = file.match(imageIdx)
  if (match) {
    file = '/public/index.html'
  }

  const fullPath = join(__dirname, file)
  streamFile(req, res, fullPath)
}

// ===================================================
//  HTTP SERVER
// ===================================================
async function startHttp (port = 8080) {
  server = http.createServer(handleRequest)
  server.on('clientError', (err, socket) => {
    if (err.code === 'ECONNRESET' || !socket.writable) {
      log('clientError', err)
      return
    }
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
  })

  const p = new Promise((resolve, reject) => {
    server.listen({ port }, () => {
      resolve(server)
      log('HTTP', `Server listening on: http://localhost:${port}`)
    })
  })
  return p
}

function stopHttp () {
  return new Promise((resolve, reject) => {
    server.close()
    log('HTTP', 'Server stopped')
    server.on('close', (err, socket) => {
      if (err) {
        reject(err)
      } else {
        resolve(server)
      }
    })
  })
}

// ========================================================
// HELPER FUNCTIONS
// ========================================================
function log (tag, ...t) {
  tag = tag.toUpperCase()
  console.log(tag, ...t)
}

// ===================================================
// "unhandled" ERROR HANDLING
// ===================================================
process.on('unhandledRejection', (error) => {
  log('unhandledRejection', error.toString())
  throw error
})

process.on('uncaughtException', (error) => {
  log('uncaughtException', error.toString())
  throw error
})

// ========================================================
// EXPORTS
// ========================================================
export { startHttp, stopHttp }
