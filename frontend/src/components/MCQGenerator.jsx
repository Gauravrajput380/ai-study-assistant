import { useState } from 'react'
import { Button, Box, Typography, CircularProgress, Alert } from '@mui/material'
import { getMCQs } from '../services/api'

export default function MCQGenerator({ documentId }) {
  const [mcqs, setMcqs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await getMCQs(documentId)
      setMcqs(res.data.mcqs)
    } catch (err) {
      setError('Failed to generate MCQs.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        MCQ Generator
      </Typography>
      <Button variant="outlined" onClick={handleGenerate}>
        Generate MCQs
      </Button>
      {loading && <CircularProgress sx={{ mt: 2, display: 'block' }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {mcqs.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {mcqs.map((mcq, i) => (
            <Box key={i} sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2, mb: 2 }}>
              <Typography style={{ whiteSpace: 'pre-line' }}>{mcq}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}