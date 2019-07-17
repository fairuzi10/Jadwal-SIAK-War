export const readFile = (file) => {
  const reader = new FileReader()
  const promise = new Promise((resolve, reject) => {
    reader.onload = e => resolve(e.target.result)
  })
  reader.readAsText(file)
  return promise
}

// HTML string to DOM document
export const readHtml = async (htmlString) => {
  const parser = new DOMParser()
  return parser.parseFromString(htmlString, 'text/html')
}
