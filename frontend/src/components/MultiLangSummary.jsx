import { useState } from 'react'
import { Button, Box, Typography, CircularProgress, Alert, Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import { getSummaryInLanguage } from '../services/api'

export default function MultiLangSummary({ documentId }) {
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [language, setLanguage] = useState('English')
  const [summaryType, setSummaryType] = useState('short')

  const handleSummary = async () => {
    setLoading(true)
    setError('')
    setSummary('')
    try {
      const res = await getSummaryInLanguage(documentId, summaryType, language)
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
        Multi Language Summary
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="lang-label">Language</InputLabel>
          <Select
            labelId="lang-label"
            value={language}
            label="Language"
            onChange={(e) => setLanguage(e.target.value)}
          >
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Hindi">Hindi</MenuItem>
            <MenuItem value="Marathi">Marathi</MenuItem>
            <MenuItem value="Tamil">Tamil</MenuItem>
            <MenuItem value="Telugu">Telugu</MenuItem>
            <MenuItem value="Bengali">Bengali</MenuItem>
            <MenuItem value="Gujarati">Gujarati</MenuItem>
            <MenuItem value="French">French</MenuItem>
            <MenuItem value="Spanish">Spanish</MenuItem>
            <MenuItem value="German">German</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="type-label">Type</InputLabel>
          <Select
            labelId="type-label"
            value={summaryType}
            label="Type"
            onChange={(e) => setSummaryType(e.target.value)}
          >
            <MenuItem value="short">Short</MenuItem>
            <MenuItem value="detailed">Detailed</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Button variant="contained" onClick={handleSummary} disabled={loading}>
        Generate Summary
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