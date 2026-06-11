import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8000'
})

export const uploadFile = (formData) => API.post('/upload', formData)
export const getSummary = (document_id, summary_type) => API.post('/summary', { document_id, summary_type })
export const getSummaryInLanguage = (document_id, summary_type, language) => API.post('/summary-language', { document_id, summary_type, language })
export const getQuestions = (document_id) => API.post('/questions', { document_id })
export const getMCQs = (document_id) => API.post('/mcq', { document_id })
export const explainTopic = (topic) => API.post('/explain', { topic })