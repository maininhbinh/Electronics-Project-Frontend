import axios, { AxiosInstance } from 'axios'

const instance: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', //http://localhost:3000 // http://127.0.0.1:8000/api
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    const { response } = error
    if (response) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('user')
        window.location.href = '/'
      }
    }
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error
    if (response) {
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

const instanceTest: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api'
})

instanceTest.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export { instanceTest }

export default instance
