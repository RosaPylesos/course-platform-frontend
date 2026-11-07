import { BrowserRouter, Routes, Route } from "react-router-dom"

import HomePage from "@/pages/HomePage"
import CatalogPage from "@/pages/CatalogPage"
import CoursePage from "@/pages/CoursePage"
import LoginPage from "@/pages/LoginPage"

import Header from "@/components/layout/Header"

function App() {
  return (
    <BrowserRouter>
      
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CatalogPage />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App