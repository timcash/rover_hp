const baseUrl = 'https://hiring.hypercore-protocol.org'

async function getImageById (id) {
  if (id === undefined || id === null || id === Infinity) {
    const url = new URL('termrover/latest', baseUrl)
    const result = await fetch(url)
    const imagePack = await result.json()
    return imagePack
  }

  const url = new URL(`termrover/${id}`, baseUrl)
  const result = await fetch(url)
  return result.json()
}

async function * iterateAssending (startIdx = 0) {
  let index = startIdx

  while (index < Infinity) {
    try {
      yield getImageById(index)
      index++
    } catch (error) {
      yield getImageById()
    }
  }
}
export { getImageById, iterateAssending }
