import fs from 'fs'
import tp from './helper/TableParser'
import { JSDOM } from 'jsdom'

function readFiles (dirname, onFileContent, onError, onSuccess) {
  fs.readdir(dirname, function (err, filenames) {
    if (err) {
      onError(err)
      return
    }
    let cnt = 0
    filenames.forEach(function (filename) {
      fs.readFile(dirname + filename, 'utf-8', function (err, content) {
        if (err) {
          onError(err)
          return
        }
        onFileContent(filename, content)
        cnt++
        if (cnt === filenames.length) {
          onSuccess()
        }
      })
    })
  })
}

process.chdir(__dirname)
const data = {}
readFiles('data/raw/', function (filename, content) {
  const htmlDoc = new JSDOM(content).window.document
  const table = htmlDoc.querySelectorAll('table.box')
  const jurusan = filename.split('.')[0].replace(' ', '-')
  data[jurusan] = tp.parse(table)
}, function (err) {
  throw err
}, function () {
  fs.writeFile('data/schedule.json', JSON.stringify(data), function (err) {
    if (err) {
      // eslint-disable-next-line no-console
      return console.error(err)
    }
    // eslint-disable-next-line no-console
    console.log('The file was saved!')
  })
})
