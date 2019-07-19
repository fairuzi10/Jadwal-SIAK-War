export const validateClasInstanceNotConflict = (className, clasInstance, chosenClass) => {
  let conflictList = []
  // tugas akhir/kerja praktik
  if (!clasInstance.WAKTU) return []
  clasInstance.WAKTU.forEach(daytime => {
    conflictList = [...conflictList, ...validateDaytimeNotConflict(className, daytime, chosenClass)]
  })
  // need to uniqueify this list because of same daytime but different lecturer class
  conflictList = [ ...new Set(conflictList) ]
  return conflictList
}

// format: HH.MM
const getTimeInMinute = time => {
  return Number(time.substr(0, 2)) * 60 + Number(time.substr(3, 2))
}

const validateDaytimeNotConflict = (className, daytime, chosenClass) => {
  const splitted = daytime.split(', ')
  const day = splitted[0]
  const time = splitted[1]

  const startTime = getTimeInMinute(time.substr(0, 5))
  const endTime = getTimeInMinute(time.substr(6, 5))

  const conflictList = []
  Object.keys(chosenClass).forEach(cmpClassName => {
    if (className !== cmpClassName && chosenClass[cmpClassName]) {
      const cmpArrDaytime = chosenClass[cmpClassName].WAKTU
      if (!cmpArrDaytime) return
      cmpArrDaytime.forEach(cmpDaytime => {
        const cmpSplitted = cmpDaytime.split(', ')
        const cmpDay = cmpSplitted[0]
        const cmpTime = cmpSplitted[1]
        const cmpStartTime = getTimeInMinute(cmpTime.substr(0, 5))
        const cmpEndTime = getTimeInMinute(cmpTime.substr(6, 5))
        if (day === cmpDay && !(cmpEndTime < startTime || endTime < cmpStartTime)) {
          conflictList.push(`Bentrok dengan <b>${chosenClass[cmpClassName]['NAMA KELAS']}</b> ` +
          `pada <b>${cmpDaytime}</b>`)
        }
      })
    }
  })
  return conflictList
}
