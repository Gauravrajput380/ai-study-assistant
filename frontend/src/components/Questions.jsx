import { useState } from 'react'
import { Button, Box, Typography, CircularProgress, Alert, List, ListItem, ListItemText } from '@mui/material'
import { getQuestions } from '../services/api'

export default function Questions({ documentId }) {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getQuestions(documentId)
      setQuestions(res.data.questions)
    } catch (err) {
      setError('Failed to generate questions.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Important Questions
      </Typography>
      <Button variant="outlined" onClick={handleGenerate}>
        Generate Questions
      </Button>
      {loading && <CircularProgress sx={{ mt: 2, display: 'block' }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {questions.length > 0 && (
        <List sx={{ mt: 2 }}>
          {questions.map((q, i) => (
            <ListItem key={i} sx={{ bgcolor: '#f5f5f5', mb: 1, borderRadius: 2 }}>
              <ListItemText primary={q} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}