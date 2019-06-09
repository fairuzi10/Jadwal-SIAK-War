export const JADWAL_LIST = 'jadwalList'
export const NAMA_JADWAL_LIST = 'namaJadwalList'
export const LAST_SEEN_JADWAL = 'lastSeenJadwal'

export const setObjectOrArray = function (key, value) {
  if (value === null) {
    localStorage.removeItem(value)
  } else {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export const getObjectOrArray = function (key) {
  const value = localStorage.getItem(key)
  return value && JSON.parse(value)
}

export const addObjectProperty = function (key, property, value) {
  const existingObject = getObjectOrArray(key)
  setObjectOrArray(key, { ...existingObject, [property]: value })
}

export const addArrayElement = function (key, value) {
  const existingArray = getObjectOrArray(key) || []
  setObjectOrArray(key, existingArray.concat(value))
}

export const getItem = function (key) {
  return localStorage.getItem(key)
}

export const setItem = function (key, value) {
  if (value === null) {
    localStorage.removeItem(key)
  } else {
    return localStorage.setItem(key, value)
  }
}
