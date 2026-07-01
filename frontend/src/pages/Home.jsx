import { useState } from 'react'
import { Box, Typography, Button, Tabs, Tab, Alert, CircularProgress, TextField, Radio, RadioGroup, FormControlLabel, FormControl, Select, MenuItem, InputLabel } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DescriptionIcon from '@mui/icons-material/Description'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import { uploadFile, getQuestions, getMCQs, explainTopic, getSummaryInLanguage } from '../services/api'
import axios from 'axios'

export default function Home() {
  const [file, setFile] = useState(null)
  const [document, setDocument] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [activeTab, setActiveTab] = useState(0)
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [topic, setTopic] = useState('')
  const [language, setLanguage] = useState('English')
  const [summaryType, setSummaryType] = useState('short')
  const [mcqs, setMcqs] = useState([])
  const [answers, setAnswers] = useState({})
  const [score, setScore] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [quizMode, setQuizMode] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState([])

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setUploadError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await uploadFile(formData)
      setDocument(res.data)
    } catch (_err) {
      setUploadError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleGenerate = async () => {
    if (!document) return
    setLoading(true)
    setError('')
    setResult('')
    setMcqs([])
    setQuizQuestions([])
    setScore(null)
    setSubmitted(false)
    setAnswers({})
    setQuizMode(false)
    try {
      if (activeTab === 0) {
        const res = await getSummaryInLanguage(document.id, summaryType, language)
        setResult(res.data.summary)
      } else if (activeTab === 1) {
        const res = await getQuestions(document.id)
        setResult(res.data.questions.join('\n'))
      } else if (activeTab === 2) {
        const res = await getMCQs(document.id)
        setMcqs(res.data.mcqs)
      } else if (activeTab === 3) {
        const res = await explainTopic(topic)
        setResult(res.data.explanation)
      }
    } catch (_err) {
      setError('Failed to generate. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateQuiz = async () => {
    if (!document) return
    setLoading(true)
    setError('')
    setScore(null)
    setSubmitted(false)
    setAnswers({})
    setResult('')
    setMcqs([])
    try {
      const res = await axios.post('https://ai-study-assistant-backend-9q9f.onrender.com/mcq-quiz', { document_id: document.id })
      setQuizQuestions(res.data.questions)
      setQuizMode(true)
    } catch (_err) {
      setError('Failed to generate quiz.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitQuiz = () => {
    let correct = 0
    quizQuestions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++
    })
    setScore(correct)
    setSubmitted(true)
  }

  const getButtonLabel = () => {
    if (activeTab === 0) return 'Generate Summary'
    if (activeTab === 1) return 'Generate 10 Important Questions'
    if (activeTab === 2) return 'Generate MCQs'
    if (activeTab === 3) return 'Explain Topic'
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa' }}>

      {/* Header */}
      <Box sx={{ bgcolor: '#1a237e', color: 'white', p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <MenuBookIcon />
          <Box>
            <Typography variant="h6" fontWeight="bold">AI Study Assistant</Typography>
            <Typography variant="caption">Upload notes. Generate summaries, questions, MCQs and explanations.</Typography>
          </Box>
        </Box>
        <Typography variant="caption" sx={{ bgcolor: 'rgba(255,255,255,0.2)', px: 2, py: 0.5, borderRadius: 1 }}>
          Provider: Groq / API
        </Typography>
      </Box>

      {/* Stats Bar */}
      <Box sx={{ bgcolor: 'white', p: 2, display: 'flex', gap: 4, borderBottom: '1px solid #e0e0e0', px: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <DescriptionIcon color="action" />
          <Typography variant="h6" fontWeight="bold">{document ? 1 : 0}</Typography>
          <Typography variant="caption" color="text.secondary">Docs</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <CheckCircleIcon color="action" />
          <Typography variant="h6" fontWeight="bold">4</Typography>
          <Typography variant="caption" color="text.secondary">Tools</Typography>
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <MenuBookIcon color="action" />
          <Typography variant="h6" fontWeight="bold">{document ? 1 : 0}</Typography>
          <Typography variant="caption" color="text.secondary">Selected</Typography>
        </Box>
      </Box>

      {/* Hero */}
      <Box sx={{ bgcolor: 'white', p: 4, mx: 3, mt: 3, borderRadius: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <Typography variant="h4" fontWeight="bold">Smart revision workspace for students</Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ display: 'flex', gap: 3, p: 3 }}>

        {/* Left — Upload */}
        <Box sx={{ width: '40%', bgcolor: 'white', borderRadius: 3, p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Upload Study Material</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Upload PDF or TXT notes. The backend extracts text and stores it in SQLite.
          </Typography>

          <Box sx={{ border: '2px dashed #90caf9', borderRadius: 3, p: 4, textAlign: 'center', my: 2, bgcolor: '#f5f9ff' }}>
            <CloudUploadIcon sx={{ fontSize: 48, color: '#1976d2' }} />
            <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
              {file ? file.name : 'Choose your study file'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supported formats: PDF and TXT
            </Typography>
          </Box>

          <input
            type="file"
            accept=".pdf,.txt"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: 'none' }}
            id="file-input"
          />
          <label htmlFor="file-input">
            <Button variant="outlined" component="span" startIcon={<CloudUploadIcon />} fullWidth sx={{ mb: 2 }}>
              BROWSE FILE
            </Button>
          </label>

          {uploadError && <Alert severity="error" sx={{ mb: 2 }}>{uploadError}</Alert>}

          {document && (
            <Alert severity="success" sx={{ mb: 2 }}>
              ✅ {document.filename} uploaded!
            </Alert>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleUpload}
            disabled={!file || uploading}
            sx={{ bgcolor: '#1a237e', py: 1.5 }}
          >
            {uploading ? <CircularProgress size={24} color="inherit" /> : 'Upload Document'}
          </Button>
        </Box>

        {/* Right — Study Tools */}
        <Box sx={{ width: '60%', bgcolor: 'white', borderRadius: 3, p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>Study Tools</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Select a feature and generate AI-powered learning material.
          </Typography>

          <Tabs value={activeTab} onChange={(e, v) => { setActiveTab(v); setResult(''); setMcqs([]); setQuizMode(false); setScore(null) }} sx={{ mb: 3 }}>
            <Tab label="Summary" />
            <Tab label="Important Questions" />
            <Tab label="MCQs" />
            <Tab label="Explain Topic" />
          </Tabs>

          {activeTab === 0 && (
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Generate short or detailed summary in any language.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Language</InputLabel>
                  <Select value={language} label="Language" onChange={(e) => setLanguage(e.target.value)}>
                    <MenuItem value="English">English</MenuItem>
                    <MenuItem value="Hindi">Hindi</MenuItem>
                    <MenuItem value="Marathi">Marathi</MenuItem>
                    <MenuItem value="Tamil">Tamil</MenuItem>
                    <MenuItem value="Telugu">Telugu</MenuItem>
                    <MenuItem value="Bengali">Bengali</MenuItem>
                    <MenuItem value="French">French</MenuItem>
                    <MenuItem value="Spanish">Spanish</MenuItem>
                  </Select>
                </FormControl>
                <FormControl sx={{ minWidth: 150 }}>
                  <InputLabel>Type</InputLabel>
                  <Select value={summaryType} label="Type" onChange={(e) => setSummaryType(e.target.value)}>
                    <MenuItem value="short">Short</MenuItem>
                    <MenuItem value="detailed">Detailed</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          )}

          {activeTab === 1 && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Generate 10 exam-focused questions from the uploaded notes.
            </Typography>
          )}

          {activeTab === 2 && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Generate multiple choice questions. Try Score Checker to test yourself!
            </Typography>
          )}

          {activeTab === 3 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Enter any topic and get a simple explanation.
              </Typography>
              <TextField
                fullWidth
                label="Enter topic name"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                sx={{ mt: 1 }}
              />
            </Box>
          )}

          <Button
            variant="contained"
            onClick={handleGenerate}
            disabled={!document || loading || (activeTab === 3 && !topic)}
            sx={{ bgcolor: '#1a237e', mb: 2 }}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : getButtonLabel()}
          </Button>

          {activeTab === 2 && (
            <Button
              variant="outlined"
              onClick={handleGenerateQuiz}
              disabled={!document || loading}
              sx={{ ml: 2, mb: 2 }}
            >
              MCQ Score Checker
            </Button>
          )}

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {result && (
            <Box sx={{ bgcolor: '#f5f9ff', p: 2, borderRadius: 2, mt: 2 }}>
              <Typography style={{ whiteSpace: 'pre-line' }}>{result}</Typography>
            </Box>
          )}

          {mcqs.length > 0 && !quizMode && (
            <Box sx={{ mt: 2 }}>
              {mcqs.map((mcq, i) => (
                <Box key={i} sx={{ p: 2, bgcolor: '#f5f9ff', borderRadius: 2, mb: 2 }}>
                  <Typography style={{ whiteSpace: 'pre-line' }}>{mcq}</Typography>
                </Box>
              ))}
            </Box>
          )}

          {quizMode && quizQuestions.length > 0 && (
            <Box sx={{ mt: 2 }}>
              {quizQuestions.map((q, i) => (
                <Box key={i} sx={{ p: 2, bgcolor: '#f5f9ff', borderRadius: 2, mb: 2 }}>
                  <Typography fontWeight="bold">{i + 1}. {q.question}</Typography>
                  <FormControl>
                    <RadioGroup onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}>
                      {Object.entries(q.options).map(([key, val]) => (
                        <FormControlLabel
                          key={key}
                          value={key}
                          control={<Radio />}
                          label={key + '. ' + val}
                          sx={{ color: submitted ? (key === q.answer ? 'green' : answers[i] === key ? 'red' : 'inherit') : 'inherit' }}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                  {submitted && (
                    <Box sx={{ mt: 1, p: 1.5, bgcolor: '#e8f5e9', borderRadius: 2, borderLeft: '4px solid green' }}>
                      <Typography variant="body2" color="green" fontWeight="bold">
                        ✅ Correct Answer: {q.answer}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        💡 {q.explanation}
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
              {!submitted && (
                <Button variant="contained" onClick={handleSubmitQuiz} sx={{ bgcolor: '#1a237e' }}>
                  Submit Quiz
                </Button>
              )}
              {submitted && (
                <Alert severity={score >= 7 ? 'success' : score >= 5 ? 'warning' : 'error'} sx={{ mt: 2 }}>
                  Your Score: {score} / {quizQuestions.length} — {score >= 7 ? '🎉 Excellent!' : score >= 5 ? '👍 Good effort!' : '📚 Keep studying!'}
                </Alert>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}