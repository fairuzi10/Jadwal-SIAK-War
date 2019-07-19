const cleanify = raw => raw.replace('-', ' ').toUpperCase()

const matchClassName = (className, filter) => cleanify(className).includes(cleanify(filter))

const matchClassInsName = (classIns, filter) => cleanify(classIns['NAMA KELAS']).includes(cleanify(filter))

const matchLecturerName = (listOfClassIns, filter) => {
  const lecturersNamePerClassIns = listOfClassIns.map(classIns => (classIns.PENGAJAR || []).join(', '))
  const allLecturersName = lecturersNamePerClassIns.join(', ')
  return cleanify(allLecturersName).includes(cleanify(filter))
}

export const matchClass = (classGroup, filter) =>
  matchClassName(classGroup.name, filter) ||
  matchClassInsName(classGroup.options[0], filter) ||
  matchLecturerName(classGroup.options, filter)
