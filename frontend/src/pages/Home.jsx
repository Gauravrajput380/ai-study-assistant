import { useState } from 'react'
import { Container, Box, Alert } from '@mui/material'
import FileUpload from '../components/FileUpload'
import Summary from '../components/Summary'
import Questions from '../components/Questions'
import MCQGenerator from '../components/MCQGenerator'
import MCQScoreChecker from '../components/MCQScoreChecker'
import MultiLangSummary from '../components/MultiLangSummary'
import TopicExplainer from '../components/TopicExplainer'

export default function Home() {
  const [document, setDocument] = useState(null)

  const handleUploadSuccess = (data) => {
    setDocument(data)
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4 }}>
        <FileUpload onUploadSuccess={handleUploadSuccess} />
        {document && (
          <Box sx={{ mt: 4 }}>
            <Alert severity="success" sx={{ mb: 4 }}>
              ✅ File "{document.filename}" uploaded successfully!
            </Alert>
            <Summary documentId={document.id} />
            <MultiLangSummary documentId={document.id} />
            <Questions documentId={document.id} />
            <MCQGenerator documentId={document.id} />
            <MCQScoreChecker documentId={document.id} />
          </Box>
        )}
        <TopicExplainer />
      </Box>
    </Container>
  )
}