import React from 'react'
import "./styles/App.css"
import Nav from "./routes/Nav"

function App() {
  return (
    <div className="app-container-light">
    
      <div className="mesh-gradient-bg"></div>

    
      <div className="particles-background">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
      </div>

      <div className="app-content fade-in">
           <Nav /> 
      </div>
    </div>
  )
}

export default App