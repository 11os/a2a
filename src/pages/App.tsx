/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useRef, useEffect } from 'react'
import ClazzItem from '../components/ClazzItem'
import './App.css'
import { DEMO_JSON } from '../api/mock'

const App: React.FC = () => {
  const [json, setJson] = useState(DEMO_JSON)
  const [clazz, setClazz] = useState('BaseResponse')
  const [result, setResult] = useState('')
  const rightView = useRef(null);

  const copyClick = (e: any) => {
    let result = e?.target?.innerText
    if (!result) return
  }
  const cleanClick = () => {
    setJson('')
    setClazz('')
    setResult('')
  }
  const demoClick = () => {
    setJson(DEMO_JSON)
    setClazz('BaseResponse')
  }

  useEffect(() => {
    setResult(json)
  }, [clazz, json])

  return (
    <div className="page-view">
      <h1>json2dart</h1>
      <p>搭配<a href="https://flutter.cn/docs/development/data-and-backend/json" target="_blank">JSON 和序列化数据</a>使用风味更佳</p>
      <div className="body-view">
        {/* left */}
        <div className="left-view">
          {/* json */}
          <textarea value={json} className="left-top-view" placeholder="paste json" onChange={(e) => { setJson(e.target.value) }}></textarea>
          {/* clazz */}
          <input value={clazz} className="left-bottom-view" placeholder="class name eg: LoginResponse" onChange={(e) => { setClazz(e.target.value) }}></input>
          {/* button */}
          <div className="left-button-view">
            <div className="left-clean-button" onClick={cleanClick}>清空</div>
            <div className="left-demo-button" onClick={demoClick}>DEMO</div>
          </div>
        </div>
        {/* right */}
        <div ref={rightView} className="right-view" onClick={copyClick} >
          {result ? <ClazzItem result={result} clazzName={clazz} /> : "edit json & auto generate dart class"}
        </div>
      </div>
      <p className="align-right">power by gai</p>
    </div>
  );
}

export default App;
