/* eslint-disable no-console */
import fs from 'fs'
import { parseTables } from './helper/table-parser'
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
readFiles('data/raw/', async function (filename, content) {
  const htmlDoc = new JSDOM(content).window.document
  const table = htmlDoc.querySelectorAll('table.box')
  const major = filename.split('.')[0].replace(' ', '-')
  const majorData = await parseTables(table)
  const dataFilename = `data/${major}.json`
  fs.writeFile(dataFilename, JSON.stringify(majorData), function (err) {
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
