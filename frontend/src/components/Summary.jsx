import { useState } from 'react'
import { Button, Box, Typography, CircularProgress, Alert } from '@mui/material'
import { getSummary } from '../services/api'

export default function Summary({ documentId }) {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSummary = async (type) => {
    setLoading(true)
    setError('')
    try {
      const res = await getSummary(documentId, type)
      setSummary(res.data.summary)
    } catch (err) {
      setError('Failed to generate summary.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Summary
      </Typography>
      <Button variant="outlined" onClick={() => handleSummary('short')} sx={{ mr: 2 }}>
        Short Summary
      </Button>
      <Button variant="outlined" onClick={() => handleSummary('detailed')}>
        Detailed Summary
      </Button>
      {loading && <CircularProgress sx={{ mt: 2, display: 'block' }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {summary && (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography>{summary}</Typography>
        </Box>
      )}
    </Box>
  )
}