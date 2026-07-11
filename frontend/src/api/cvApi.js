import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

const handleError = (error, endpoint) => {
  console.error(`[cvApi] Error fetching ${endpoint}:`, error)
  throw error
}

export const fetchProfile = async () => {
  try {
    const { data } = await api.get('/profile')
    return data
  } catch (error) {
    handleError(error, '/profile')
  }
}

export const fetchExperience = async () => {
  try {
    const { data } = await api.get('/experience')
    return data
  } catch (error) {
    handleError(error, '/experience')
  }
}

export const fetchSkills = async () => {
  try {
    const { data } = await api.get('/skills')
    return data
  } catch (error) {
    handleError(error, '/skills')
  }
}

export const fetchProjects = async () => {
  try {
    const { data } = await api.get('/projects')
    return data
  } catch (error) {
    handleError(error, '/projects')
  }
}

export const fetchCertifications = async () => {
  try {
    const { data } = await api.get('/certifications')
    return data
  } catch (error) {
    handleError(error, '/certifications')
  }
}

export const fetchEducation = async () => {
  try {
    const { data } = await api.get('/education')
    return data
  } catch (error) {
    handleError(error, '/education')
  }
}

export const fetchGitHubActivity = async () => {
  try {
    const { data } = await api.get('/github/activity')
    return data
  } catch (error) {
    handleError(error, '/github/activity')
  }
}

export const fetchStatus = async () => {
  try {
    const { data } = await api.get('/status')
    return data
  } catch (error) {
    handleError(error, '/status')
  }
}

export const postContact = async (payload) => {
  try {
    const { data } = await api.post('/contact', payload)
    return data
  } catch (error) {
    handleError(error, '/contact')
  }
}
