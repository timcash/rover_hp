import { chromium } from 'playwright'
import { devices } from '@playwright/test'
import { startHttp, stopHttp } from '../src/http.js'
import { test, configure } from 'brittle'

configure({ serial: true })

// ========================================================
// BROWSER CONFIGURATION
// ========================================================
const baseUrl = 'http://localhost:8080'
const iPad = devices['iPad Pro 11 landscape']
const browser = await chromium.launch({
  // headless: false,
  // slowMo: 1000,
  // devtools: true
})
const context = await browser.newContext({
  ...iPad
})

// ========================================================
// START SERVER
// ========================================================
test('server starts', async (t) => {
  const server = await startHttp()
  t.is(server.listening, true)
})

// ========================================================
// TEST UI WITH REAL BROWSER VIA PLAYWRIGHT
// ========================================================
test('/15 get an image by :index', async (t) => {
  const page = await context.newPage()
  const imageIdx = 15
  const url = new URL(`/${imageIdx}`, baseUrl)
  const response = await page.goto(url.toString())
  t.is(response.status(), 200)
  await page.locator(`#_${imageIdx}`)
  t.pass(`/:index image at ${imageIdx}`)
  t.end()
})

test('/ display assending images', async (t) => {
  const page = await context.newPage()
  const url = new URL('/', baseUrl)
  const response = await page.goto(url.toString())

  t.is(response.status(), 200)
  await page.locator('#_0')
  await page.locator('#_1')
  await page.locator('#_2')
  t.pass('images cycled')
  t.end()
})

test('/?ms=100 display assending images faster!', async (t) => {
  const page = await context.newPage()
  const url = new URL('/?ms=100', baseUrl)
  const response = await page.goto(url.toString())

  t.is(response.status(), 200)
  await page.locator('#_0')
  await page.locator('#_1')
  await page.locator('#_2')
  t.pass('images cycled faster')
  t.end()
})

test('/1 mouseover should display metadata sol and date', async (t) => {
  const page = await context.newPage()
  const url = new URL('/1', baseUrl)
  const response = await page.goto(url.toString())

  t.is(response.status(), 200)
  // move the mouse over the image
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
})

// ========================================================
// STOP SERVER
// ========================================================
test('stop the server', async (t) => {
  await browser.close()
  const server = await stopHttp()
  t.is(server.listening, false)
})

// ===================================================
// "unhandled" ERROR HANDLING
// ===================================================
process.on('unhandledRejection', async (error) => {
  await stopHttp()
  throw error
})

process.on('uncaughtException', async (error) => {
  await stopHttp()
  throw error
})
