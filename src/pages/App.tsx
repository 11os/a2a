/* eslint-disable react/jsx-no-target-blank */
import React, { useState, useRef, useEffect } from 'react'
import ClazzItem from '../components/ClazzItem'
import './App.css'

const App: React.FC = () => {
  const [json, setJson] = useState('')
  const [clazz, setClazz] = useState('')
  const [result, setResult] = useState('')
  const rightView = useRef(null);
  const confirmClick = () => {
    // setResult(json2dart(json, clazz))
  }
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
    let json = `{
      "code": 1,
      "data": [{
          "commodityType": 2,
          "contentNum": 1,
          "coverUrl": "https://pic.manqian.cn/f16bb207-0b55-4bf4-93d2-034bf535f06d?t=1571975702038",
          "description": "普通课程-01",
          "free": false,
          "hasBuy": false,
          "href": "javascript:",
          "id": "4638977926580224",
          "introduce": "",
          "name": "普通课程-01",
          "possess": false,
          "price": 100,
          "studentNum": 52
        }
      ],
      "message": "成功",
      "nowpage": 1,
      "total": 34
    }`
    setJson(json)
    setClazz('BaseResponse')
  }

  useEffect(() => setResult(json), [clazz, json])

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
            <div className="left-confirm-button" onClick={confirmClick}>自动生成无需点击</div>
            <div className="left-clean-button" onClick={cleanClick}>清空</div>
            <div className="left-demo-button" onClick={demoClick}>DEMO</div>
          </div>
        </div>
        {/* right */}
        <div ref={rightView} className="right-view" onClick={copyClick} >
          <ClazzItem result={result} clazzName={clazz} />
        </div>
      </div>
      <p className="align-right">power by gai</p>
    </div>
  );
}

export default App;
