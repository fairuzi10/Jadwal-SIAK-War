import fs from 'fs'

export const readFileAsync = filename => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf-8', (err, content) => {
      if (err) {
        reject(err)
      }
      resolve(content)
    })
  })
}

export const writeFileAsync = (filename, text) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, text, err => {
      if (err) {
        reject(err)
      }
      resolve()
    })
  })
}
