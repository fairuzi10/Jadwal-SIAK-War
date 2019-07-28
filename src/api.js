import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://jadwal-siak-war.appspot.com/'
})

export const postHTMLFile = (file, isAnonymous) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('anonymous', isAnonymous)
  return instance.post('/html-file', formData)
}
