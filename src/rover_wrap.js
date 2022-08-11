// ========================================================
// NOTES
// ========================================================
// getLatest() -> imagePack
// iterateAssending(imagePack) -> *[imagePack]

const baseUrl = 'https://hiring.hypercore-protocol.org'

async function getImageById (id) {
  if (id === undefined || id === null || id === Infinity) {
    const url = new URL('termrover/latest', baseUrl)
    const result = await fetch(url)
    const imagePack = await result.json()
    return imagePack
  }
}

export { getImageById }
