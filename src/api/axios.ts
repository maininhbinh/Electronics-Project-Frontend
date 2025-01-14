import axios, { AxiosInstance } from 'axios'
axios.defaults.withCredentials = true;

const instance: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true
})

const instanceTest: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true
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
