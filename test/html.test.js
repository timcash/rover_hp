import { chromium } from 'playwright'
import { devices } from '@playwright/test'
import { startHttp, stopHttp } from '../src/http.js'
import { test, configure } from 'brittle'

configure({ serial: true })

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
test('/15 should get an image by :index', async (t) => {
  const page = await context.newPage()
  const imageIdx = 15
  const url = new URL(`/${imageIdx}`, baseUrl)
  const response = await page.goto(url.toString())
  t.is(response.status(), 200)
  await page.locator(`#_${imageIdx}`)
  t.pass(`/:index image at ${imageIdx}`)
  t.end()
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
