import { generate, ParseTypeEnum } from '@a2a/sdk'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'
import ClipboardJS from 'clipboard'
import hljs from 'highlight.js/lib/core'
import typescript from 'highlight.js/lib/languages/typescript'
import 'highlight.js/styles/vs2015.css'
import { useEffect, useState } from 'react'
import './index.css'

export const DEMO_JSON = `{
  "code": 0,
  "bigInt": 9007199254740991,
  "doubleValue": 100.00,
  "message": null,
  "": "empty key name",
  "auth": false,
  "pageInfo": {
    "pageNum": 1,
    "pageSize": 10
  },
  "enum": ["a", "o", "e"],
  "data": [{
    "id": "4638977926580224",
    "title": "普通课程",
    "price": 1000,
    "hasBuy": false,
    "studentNum": 52
  }]
}`

export default function Editor() {
  const [json, setJson] = useState(DEMO_JSON)
  const [clazz, setClazz] = useState('BaseResponse')
  const [result, setResult] = useState('')
  const [isCopySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    new ClipboardJS('.footer-copy-button', {
      text: function () {
        const source: any = document.querySelector('.editor-body-right')
        return source.innerText
      }
    }).on('success', () => {
      setCopySuccess(true)
    })
    hljs.registerLanguage('typescript', typescript)
  }, [])

  const demoClick = () => {
    setJson(DEMO_JSON)
    setClazz('BaseResponse')
  }

  const cleanClick = () => {
    setJson('')
    setClazz('')
  }

  useEffect(() => {
    const ts = generate({ json, clazz, type: ParseTypeEnum.typescript })
    const result = hljs.highlight('typescript', ts).value
    setResult(result)
  }, [clazz, json])
  return (
    <div className="editor">
      <div className="editor-header">json2ts</div>
      <div className="editor-body">
        <textarea
          className="editor-body-left"
          value={json}
          placeholder="paste json"
          onChange={(e) => {
            setJson(e.target.value)
          }}
        ></textarea>
        <div className="editor-body-right">
          {result ? <div dangerouslySetInnerHTML={{ __html: result }}></div> : 'edit json & auto generate dart class'}
        </div>
      </div>
      <div className="editor-footer">
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <TextField
              id="outlined-basic"
              label="clazz name"
              value={clazz}
              onChange={(e) => {
                setClazz(e.target.value)
              }}
            />
          </Grid>
          <Grid item>
            <Button className="footer-clean-button" variant="contained" color="secondary" onClick={cleanClick}>
              CLEAN
            </Button>
          </Grid>
          <Grid item>
            <Button className="footer-demo-button" variant="contained" onClick={demoClick}>
              DEMO
            </Button>
          </Grid>
          <Grid item>
            <Button
              className="footer-copy-button"
              variant="contained"
              color="primary"
              onMouseOut={() => {
                setCopySuccess(false)
              }}
            >
              COPY
            </Button>
          </Grid>
          {isCopySuccess && (
            <Grid item>
              <span className="footer-copy-hint"> copy to clipboard success 👿 </span>
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  )
}
