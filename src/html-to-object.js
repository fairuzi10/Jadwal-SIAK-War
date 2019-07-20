/* eslint-disable no-console */
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
readFiles('data/raw/', function (filename, content) {
  const htmlDoc = new JSDOM(content).window.document
  const table = htmlDoc.querySelectorAll('table.box')
  const jurusan = filename.split('.')[0].replace(' ', '-')
  const jurusanData = tp.parse(table)
  const dataFilename = `data/${jurusan}.json`
  fs.writeFile(dataFilename, JSON.stringify(jurusanData), function (err) {
    if (err) {
      return console.error(err)
    }
    console.log(`${dataFilename} was saved!`)
  })
}, function (err) {
  throw err
}, function () {
  console.log('Preprocessing completed')
})
