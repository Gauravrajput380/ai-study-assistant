import { useState } from 'react'
import { Button, Box, Typography, CircularProgress, Alert, Radio, RadioGroup, FormControlLabel, FormControl } from '@mui/material'
import axios from 'axios'

export default function MCQScoreChecker({ documentId }) {
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [score, setScore] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    setScore(null)
    setSubmitted(false)
    setAnswers({})
    try {
      const res = await axios.post('http://localhost:8000/mcq-quiz', { document_id: documentId })
      setQuestions(res.data.questions)
    } catch (err) {
      setError('Failed to generate quiz.')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (index, value) => {
    setAnswers({ ...answers, [index]: value })
  }

  const handleSubmit = () => {
    let correct = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) correct++
    })
    setScore(correct)
    setSubmitted(true)
  }

  const getColor = (q, i, key) => {
    if (!submitted) return 'inherit'
    if (key === q.answer) return 'green'
    if (answers[i] === key) return 'red'
    return 'inherit'
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        MCQ Score Checker
      </Typography>
      <Button variant="outlined" onClick={handleGenerate}>
        Generate Quiz
      </Button>
      {loading && <CircularProgress sx={{ mt: 2, display: 'block' }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {questions.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {questions.map((q, i) => (
            <Box key={i} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, mb: 2 }}>
              <Typography fontWeight="bold">{i + 1}. {q.question}</Typography>
              <FormControl>
                <RadioGroup onChange={(e) => handleAnswer(i, e.target.value)}>
                  {Object.entries(q.options).map(([key, val]) => (
                    <FormControlLabel
                      key={key}
                      value={key}
                      control={<Radio />}
                      label={key + '. ' + val}
                      sx={{ color: getColor(q, i, key) }}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          ))}
          {!submitted && (
            <Button variant="contained" onClick={handleSubmit}>
              Submit Quiz
            </Button>
          )}
          {submitted && (
            <Alert severity={score >= 7 ? 'success' : score >= 5 ? 'warning' : 'error'} sx={{ mt: 2 }}>
              Your Score: {score} / {questions.length}
            </Alert>
          )}
        </Box>
      )}
    </Box>
  )
}