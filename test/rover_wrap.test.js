// ========================================================
// IMPORTS
// ========================================================
import { getImageById, iterateAssending } from '../src/rover_wrap.js'
import { test, configure } from 'brittle'

configure({ serial: true })
// ========================================================
// TESTS
// ========================================================
test('getImageById() gets the latest image', async (t) => {
  const imagePack = await getImageById()
  isImagePack(t, imagePack)
})

test('getImageById(n) gets the nth image', async (t) => {
  const imagePack = await getImageById(1)
  const intIndex = parseInt(imagePack.index)
  t.is(intIndex, 1)
  isImagePack(t, imagePack)
})

test('iterateAssending() returns an iterator of imagePack data structures', async (t) => {
  let counter = 0
  // make prev_date the beginning of the epoch
  let prevDate = new Date(0)

  for await (const imagePack of iterateAssending()) {
    isImagePack(t, imagePack)
    // verify that the date is increasing
    const date = new Date(imagePack.metadata.earth_date)
    t.is(date >= prevDate, true)
    counter++
    prevDate = date
    if (counter > 2) break
  }
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

function isImagePack (t, imagePack) {
  t.is(typeof imagePack.metadata.id, 'number')
  t.is(typeof imagePack.metadata.sol, 'number')
  t.is(typeof new Date(imagePack.metadata.earth_date), 'object')
  t.is(typeof imagePack.images.ascii, 'string')
  t.is(typeof imagePack.images.base64, 'string')
}
