/**
 * converts array-like object to array
 * @param  collection the object to be converted
 * @return {Array} the converted object
 */
function arrayify (collection) {
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
  'DEFAULT': dom => dom.innerText
}

/**
 * generates factory functions to convert table rows to objects,
 * based on the titles in the table's <thead>
 * @param  {Array[String]} headings the values of the table's <thead>
 * @return {Function}      a function that takes a table row and spits out an object
 */
function factory (headings) {
  return function (row) {
    return arrayify(row.cells).reduce(function (prev, curr, i) {
      const currCleanifier = cleanifier[headings[i]] || cleanifier['DEFAULT']
      prev[headings[i]] = currCleanifier(curr)
      return prev
    }, {})
  }
}

/**
 * given a table, generate an array of objects.
 * each object corresponds to a row in the table.
 * each object's key/value pairs correspond to a column's heading and the row's value for that column
 *
 * @param  {HTMLTableElement} table the table to convert
 * @return {Array[Object]}       array of objects representing each row in the table
 */
const parse = function (tables) {
  var headings = arrayify(tables[0].tBodies[0].rows[1].cells).map(function (heading) {
    // for now, only NO. has unclean name.
    return heading.innerText.replace('.', '').toLocaleUpperCase()
  })

  const htmlTableToObject = table => {
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
          activeClass = classNameEl.innerText
          activeList = []
        }
      } else if (row.cells.length === headings.length) {
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

  const classOpt = arrayify(tables).reduce((accumulator, table) => {
    return { ...accumulator, ...htmlTableToObject(table) }
  }, {})
  return classOpt
}

export default {
  parse
}
