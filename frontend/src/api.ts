import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000'
})

export async function login(email: string, password: string) {
  const { data } = await api.post('/auth/login', { email, password })
  localStorage.setItem('token', data.token || 'demo')
  return data.user
}

export async function getDeals() {
  const { data } = await api.get('/deals')
  return data
}

export default api
