/* eslint-disable no-console */
import fs from 'fs'
import path from 'path'
import { parseTables } from './helper/table-parser'
import { readFileAsync, writeFileAsync } from './helper/local-reader'
import { slugify } from './helper/utils'
import { JSDOM } from 'jsdom'

const selectedFileOfMajor = {}
const majorOptions = []

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

      // async check
      if (selectedFileOfMajor[major] === filename) {
        console.log(`Using ${filename} for ${major}`)
        const slugifiedMajor = slugify(major)
        const dataFilename = `${slugifiedMajor}.json`
        await writeFileAsync(dataFilename, JSON.stringify(data))
        majorOptions.push({ label: major, value: slugifiedMajor })
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
    await writeFileAsync('major-options.json', JSON.stringify(majorOptions))
  } catch (err) {
    console.error(err)
  }
}

main()
