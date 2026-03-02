import { ComponentShowcase } from "@/components/ComponentShowcase"
import { BrowserRouter, Route, Routes } from "react-router-dom"

function App() {
  return (
    <BrowserRouter basename="/gdesignsystem">
      <Routes>
        <Route path="/" element={<ComponentShowcase />} />
        <Route path="/components/:id" element={<ComponentShowcase />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
