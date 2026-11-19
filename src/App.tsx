import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import { LanguageProvider } from './lib/LanguageContext'

export default function App() {
  return (
    <LanguageProvider>
      <Routes>
        <Route path="*" element={<Home />} />
      </Routes>
    </LanguageProvider>
  )
}
