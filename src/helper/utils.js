export const deepClone = (obj) => obj && JSON.parse(JSON.stringify(obj))

export const isSameClassInstance = (classInstance1, classInstance2) =>
  (classInstance1 === classInstance2) ||
  (classInstance1 && classInstance2 && classInstance1['NAMA KELAS'] === classInstance2['NAMA KELAS'])
