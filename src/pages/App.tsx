import React, { useState, useEffect } from 'react';
import { handleJson } from '../utils/json2dart'
import './App.css';

const App: React.FC = () => {
  const [json, setJson] = useState('')
  const [clazz, setClazz] = useState('')
  const [result, setResult] = useState('')
  const confirmClick = () => {
    setResult(handleJson(json, clazz))
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

  useEffect(() => setResult(handleJson(json, clazz)), [clazz, json])

  return (
    <div className="page-view">
      <h1>json2dart</h1>
      <p>搭配<a href="https://flutter.cn/docs/development/data-and-backend/json">JSON 和序列化数据</a>使用风味更佳</p>
      <div className="body-view">
        {/* left */}
        <div className="left-view">
          <textarea value={json} className="left-top-view" placeholder="paste json" onChange={(e) => { setJson(e.target.value) }}></textarea>
          <input value={clazz} className="left-bottom-view" placeholder="class name eg: LoginResponse" onChange={(e) => { setClazz(e.target.value) }}></input>
          <div className="left-button-view">
            <div className="left-confirm-button" onClick={confirmClick}>生成</div>
            <div className="left-clean-button" onClick={cleanClick}>清空</div>
            <div className="left-demo-button" onClick={demoClick}>DEMO</div>
          </div>
        </div>
        {/* right */}
        <div className="right-view">
          <span>{result}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
