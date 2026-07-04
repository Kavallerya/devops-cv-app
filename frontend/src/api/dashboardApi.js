import axios from 'axios'

export const fetchStatus = async () => {
  const { data } = await axios.get('/api/status')
  return data
}

export const fetchProjects = async () => {
  const { data } = await axios.get('/api/projects')
  return data
}

export const fetchEducation = async () => {
  const { data } = await axios.get('/api/education')
  return data
}

export const fetchGitHubActivity = async () => {
  const { data } = await axios.get('/api/github/activity')
  return data
}

export const submitContact = async (payload) => {
  const { data } = await axios.post('/api/contact', payload)
  return data
}