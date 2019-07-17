/**
 * converts array-like object to array
 * @param  collection the object to be converted
 * @return {Array} the converted object
 */
const arrayify = (collection) => {
  return Array.prototype.slice.call(collection)
}

const cleanifier = {
  'PENGAJAR': dom => dom.innerHTML.replace(/-/g, '')
    .split('<br>')
    .map(str => str.trim())
    .filter(str => Boolean(str)),
  'PERIODE': dom => dom.innerHTML.split('<br>'),
  'RUANG': dom => dom.innerHTML.split('<br>'),
  'WAKTU': dom => dom.innerHTML.split('<br>'),
  'DEFAULT': dom => dom.textContent
}

/**
 * generates factory functions to convert table rows to objects,
 * based on the titles in the table's <thead>
 * @param  {Array[String]} headings the values of the table's <thead>
 * @return {Function}      a function that takes a table row and spits out an object
 */
const factory = (headings) => {
  return function (row) {
    const cells = arrayify(row.cells)
    // SPECIAL CASE: keterangan mata kuliah spesial will be in PERIODE column
    return cells.reduce(function (prev, curCell, i) {
      const currCleanifier = cleanifier[headings[i]] || cleanifier['DEFAULT']
      prev[headings[i]] = currCleanifier(curCell)
      return prev
    }, {})
  }
}

const htmlTableToObject = (headings, table) => {
  let activeClass = null
  let activeList = null
  const result = {}
  const rows = table.tBodies[0].rows
  for (let i = 2; i < rows.length; i++) {
    const row = rows[i]
    if (row.classList.length === 0) {
      const classNameEl = row.querySelector('strong')
      if (classNameEl) {
        if (activeList) {
          result[activeClass] = {
            name: activeClass,
            options: activeList
          }
        }
        activeClass = classNameEl.textContent
        activeList = []
      }
    } else {
      activeList.push(factory(headings)(row))
    }
  }
  if (activeList) {
    result[activeClass] = {
      name: activeClass,
      options: activeList
    }
  }
  return result
}

// table DOM to classOpt object
export const parseTables = async (tables) => {
  const headings = arrayify(tables[0].tBodies[0].rows[1].cells).map((heading) => {
    // for now, only NO. has unclean name.
    return heading.textContent.replace('.', '').toLocaleUpperCase()
  })

  const classOpt = arrayify(tables).reduce((accumulator, table) => ({ ...accumulator, ...htmlTableToObject(headings, table) }), {})
  return classOpt
}
