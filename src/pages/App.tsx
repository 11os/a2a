import React, { useState } from 'react';
import { handleJson } from '../utils/json2dart'
import './App.css';

const App: React.FC = () => {
  const [json, setJson] = useState('')
  const [clazz, setClazz] = useState('')
  const [result, setResult] = useState('')
  const confirmClick = () => {
    setResult(handleJson(json, clazz))
  }
  return (
    <div className="page-view">
      {/* left */}
      <div className="left-view">
        <textarea value={json} className="left-top-view" placeholder="paste json" onChange={(e) => { setJson(e.target.value) }}></textarea>
        <input value={clazz} className="left-bottom-view" placeholder="class name eg: LoginResponse" onChange={(e) => { setClazz(e.target.value) }}></input>
        <div className="left-confirm-button" onClick={confirmClick}>生成</div>
      </div>
      {/* right */}
      <div className="right-view">
        <span >{result}</span>
      </div>
    </div>
  );
}

export default App;
