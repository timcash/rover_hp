// ========================================================
// IMPORTS
// ========================================================
import { getImageById } from '../src/rover_wrap.js'
import { test, configure } from 'brittle'

configure({ serial: true })
// ========================================================
// TESTS
// ========================================================
test('getImageById() gets the latest image', async (t) => {
  const imagePack = await getImageById()
  isImagePack(t, imagePack)
})

function isImagePack (t, imagePack) {
  t.is(typeof imagePack.metadata.id, 'number')
  t.is(typeof imagePack.metadata.sol, 'number')
  t.is(typeof new Date(imagePack.metadata.earth_date), 'object')
  t.is(typeof imagePack.images.ascii, 'string')
  t.is(typeof imagePack.images.base64, 'string')
}
