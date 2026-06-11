import { useState } from 'react'
import { Button, Box, Typography, CircularProgress, Alert, TextField } from '@mui/material'
import { explainTopic } from '../services/api'

export default function TopicExplainer() {
  const [topic, setTopic] = useState('')
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleExplain = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await explainTopic(topic)
      setExplanation(res.data.explanation)
    } catch (err) {
      setError('Failed to explain topic.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Topic Explainer
      </Typography>
      <TextField
        fullWidth
        label="Enter a topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="outlined" onClick={handleExplain} disabled={!topic || loading}>
        Explain
      </Button>
      {loading && <CircularProgress sx={{ mt: 2, display: 'block' }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {explanation && (
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
          <Typography>{explanation}</Typography>
        </Box>
      )}
    </Box>
  )
}