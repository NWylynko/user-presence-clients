import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { PresenceProvider } from './presence'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <PresenceProvider user={{ userId: "123" }}>
      <App />
    </PresenceProvider>
  </React.StrictMode>
)
