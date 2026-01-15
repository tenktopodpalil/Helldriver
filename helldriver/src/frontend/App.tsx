import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(1)

  return (
    <>
      <div>
        <a href="https://tse1.mm.bing.net/th/id/OIP.qodvD44LDsAr8n6n5CusTQHaF0?rs=1&pid=ImgDetMain&o=7&rm=3">
          <img src='https://tse1.mm.bing.net/th/id/OIP.qodvD44LDsAr8n6n5CusTQHaF0?rs=1&pid=ImgDetMain&o=7&rm=3' alt='AAAAAAAAAAAAAAAAAA!!!'></img>
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>I NEED STIMS!</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          AAAAAAAAAAAAAAAAAAA!!! x{count}
        </button>
        <p>
          AAAAAAAAAAAAAAAAAAA!!!
        </p>
      </div>
      <p className="read-the-docs">
        A! AAAA! AAAAAAAAAAAAAAAAAAA!!!
      </p>
    </>
  )
}

export default App
