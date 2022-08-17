import { getImageById, iterateAssending } from '../src/public/rover_wrap.js'
import { test, configure } from 'brittle'

configure({ serial: true })

test('getImageById() gets the latest image', async (t) => {
  const imagePack = await getImageById()
  t.snapshot(imagePack)
})

test('getImageById(n) gets the nth image', async (t) => {
  const imagePack = await getImageById(1)
  t.snapshot(imagePack)
})

test('iterateAssending() returns an iterator of imagePack data structures', async (t) => {
  const imagePacks = []
  let prevDate = new Date(0)

  for await (const imagePack of iterateAssending()) {
    // verify that the date is increasing
    const date = new Date(imagePack.metadata.earth_date)
    t.is(date >= prevDate, true)
    imagePacks.push(imagePack)
    prevDate = date
    if (imagePacks.length > 2) break
  }
  t.snapshot(imagePacks)
})

test('iterateAssending() past the largest idx returns latest imagePack', async (t) => {
  let counter = 0
  for await (const imagePack of iterateAssending(999999)) {
    const latest = await getImageById()
    t.is(imagePack.index, latest.index)
    counter++
    if (counter > 2) break
  }
})
