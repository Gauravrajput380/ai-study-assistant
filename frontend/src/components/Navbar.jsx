import { AppBar, Toolbar, Typography } from '@mui/material'
import MenuBookIcon from '@mui/icons-material/MenuBook'

export default function Navbar() {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <MenuBookIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div">
          AI Study Assistant
        </Typography>
      </Toolbar>
    </AppBar>
  )
}