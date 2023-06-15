import ChatRoom from "./pages/ChatRoom"
import './App.css'
import { ChatHolderProvider } from "./context/ChatHolderContext"

function App() {

  return (
    <div className="app">
      <ChatHolderProvider>
        <ChatRoom/>
      </ChatHolderProvider>
    </div>
  )
}

export default App
