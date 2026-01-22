import { MemoryRouter as Router, Routes, Route, data } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import fetchNurkiAPI from '../main/API';
import { use, useState } from 'react';

function Hello() {
  const [text,setText] = useState<string>('');
// renderer.js

async function fetchAPIData() {
  const data = await window.api.getAPI();
  console.log(data[0].setting.overrideBrief);
  setText(data[0].setting.overrideBrief);
}
fetchAPIData();
  return (
    <div>
      <div className="Hello">
        <img width="200" alt="icon" src={icon} />
      </div>
      <h1>electron-react-boilerplate</h1>
      <div className="Hello">
        <a
          href="https://electron-react-boilerplate.js.org/"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="books">
              📚{text}
            </span>
            
          </button>
        </a>
        <a
          href="https://github.com/sponsors/electron-react-boilerplate"
          target="_blank"
          rel="noreferrer"
        >
          <button type="button">
            <span role="img" aria-label="folded hands">
              🙏
            </span>
            Donate
          </button>
        </a>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
