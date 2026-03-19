import axios from 'axios'

const handleError = (error, endpoint) => {
  console.error(`[cvApi] Error fetching ${endpoint}:`, error)
  throw error
}

export const fetchProfile = async () => {
  try {
    const { data } = await axios.get('/api/profile')
    return data
  } catch (error) {
    handleError(error, '/api/profile')
  }
}

export const fetchExperience = async () => {
  try {
    const { data } = await axios.get('/api/experience')
    return data
  } catch (error) {
    handleError(error, '/api/experience')
  }
}

export const fetchSkills = async () => {
  try {
    const { data } = await axios.get('/api/skills')
    return data
  } catch (error) {
    handleError(error, '/api/skills')
  }
}
