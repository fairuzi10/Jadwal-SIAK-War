/* eslint-disable no-console */
import fs from 'fs'
import { JSDOM } from 'jsdom'
import path from 'path'

import { readFileAsync, writeFileAsync } from './helper/local-reader'
import { parseTables } from './helper/table-parser'
import { deepCompare, slugify } from './helper/utils'

const selectedFileOfMajor = {}

const processFile = async filename => {
  const content = await readFileAsync(filename)
  const htmlDoc = new JSDOM(content).window.document

  let personalData = htmlDoc.querySelector('.linfo > strong').textContent.trim().split('\n').map(str => str.trim())
  // the submitter removes his name
  if (personalData.length === 2) {
    personalData = ['anonim', ...personalData]
  }

  const isAnonymous = filename.split('.')[1] === 'true'
  const submitterName = isAnonymous ? 'anonim' : personalData[0]
  const major = personalData[2].replace(/ \(.*\)/g, '') // remove major code

  try {
    if (!selectedFileOfMajor[major] || selectedFileOfMajor[major] < filename) {
      selectedFileOfMajor[major] = filename
      const table = htmlDoc.querySelectorAll('table.box')
      const classOptions = await parseTables(table)
      const data = {
        submitterName,
        major,
        classOptions
      }

      const dataFilename = `${slugify(major)}.json`
      let sameWithExistingData = false
      try {
        const existingData = await import(`./data/${dataFilename}`)
        sameWithExistingData = deepCompare(existingData.default.classOptions, classOptions)
      } catch (err) {}

      if (!sameWithExistingData && selectedFileOfMajor[major] === filename) {
        console.log(`Using ${filename} for ${major}`)
        await writeFileAsync(dataFilename, JSON.stringify(data))
      }
    }
  } catch (err) {
    selectedFileOfMajor[major] = null
    console.error(err)
  }
}

const main = async () => {
  try {
    process.chdir(path.join(__dirname, 'data'))
    const filenames = fs.readdirSync('raw').map(filename => path.join('raw', filename))
    // process with the latest datetime first
    filenames.sort().reverse()
    await Promise.all(
      filenames.map(filename => processFile(filename).catch(console.error))
    )
    const majorOptions = Object.keys(selectedFileOfMajor).map(major => ({ label: major, value: slugify(major) }))
    await writeFileAsync('major-options.json', JSON.stringify(majorOptions))
  } catch (err) {
    console.error(err)
  }
}

main()
