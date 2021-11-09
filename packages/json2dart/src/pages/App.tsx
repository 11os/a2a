import { generate, ParseTypeEnum } from '@a2a/sdk'
import { notification, Tooltip } from 'antd'
import ClipboardJS from 'clipboard'
import hljs from 'highlight.js/lib/core'
import dart from 'highlight.js/lib/languages/dart'
import 'highlight.js/styles/vs2015.css'
import React, { useEffect, useRef, useState } from 'react'
import { DEMO_JSON } from '../api/mock'
import './App.css'

const App: React.FC = () => {
  const [json, setJson] = useState(DEMO_JSON)
  const [clazz, setClazz] = useState('BaseResponse')
  const [result, setResult] = useState('')
  const rightView = useRef(null);

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
    new ClipboardJS('.left-copy-button', {
      text: function (trigger) {
        let source: any = document.querySelector('.right-view')
        return source.innerText
      },
    }).on("success", () => {
      notification.destroy()
      notification.success({
        key: 'clipboard',
        message: 'success',
        description: 'save source to ur clipboard.',
        duration: 2,
      });
    })
    hljs.registerLanguage('dart', dart)
  }, [])

  useEffect(() => {
    const code = generate({ json, clazz, type: ParseTypeEnum.dart })
    const result = hljs.highlight(code, { language: 'dart' }).value
    setResult(result)
  }, [clazz, json])

  return (
    <div className="page-view">
      <h1>json2dart</h1>
      <p>搭配<a href="https://flutter.cn/docs/development/data-and-backend/json" target="_blank" rel="noopener noreferrer">JSON 和序列化数据</a>使用风味更佳</p>
      <div className="body-view">
        {/* left */}
        <div className="left-view">
          {/* json */}
          <textarea value={json} className="left-top-view" placeholder="paste json" onChange={(e) => { setJson(e.target.value) }}></textarea>
          {/* clazz */}
          <input value={clazz} className="left-bottom-view" placeholder="class name eg: LoginResponse" onChange={(e) => { setClazz(e.target.value) }}></input>
          {/* button */}
          <div className="left-button-view">
            <div className="left-clean-button" onClick={cleanClick}>clear</div>
            <div className="left-demo-button" onClick={demoClick}>demo</div>
            <div className="left-copy-button">copy</div>
          </div>
        </div>
        {/* right */}
        <Tooltip placement="topRight" title="↗ love u ↗">
          <div ref={rightView} className="right-view">
            {result ? <div dangerouslySetInnerHTML={{ __html: result }}/> : "edit json & auto generate dart class"}
          </div>
        </Tooltip>
      </div>
      <p className="align-right">power by gai</p>
    </div>
  );
}

export default App;
