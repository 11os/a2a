import { AstNode } from '@a2a/core'
import { LoopInfo, ParamInfo } from '../entity/ClazzInfo'
import { json2ts } from '../utils/json2ts'
import './index.css'

interface ClazzProps {
  result?: string
  ast?: AstNode
  clazzName: string
}
const ClazzItem: React.FC<ClazzProps> = ({ result, ast, clazzName }) => {
  try {
    const { params, loop }: { params: ParamInfo[], loop: LoopInfo[] } = json2ts({ result, ast })
    return params ? <>
      {/* class */}
      <div><span className="pink">export</span> <span className="blue"> interface </span><span className="green">{clazzName || 'Response'}</span> <span className="white">{`{`}</span></div>
      {/* params */}
      {params.map((ele: ParamInfo, idx: number) => <div key={ele.key + idx} >  <span className="blue">{ele.key}</span>: <span className="green">{ele.type}</span>;{ele.comment && <span className="red"> // {ele.comment}</span>}</div>)}
      {/* define */}
      <span className="white">&rbrace;</span>
      <br />
      {loop && loop.map((ele: LoopInfo, index: number) => <ClazzItem key={index} ast={ele.node} clazzName={ele.clazz} />)}
    </> : null
  } catch (e: any) {
    return <div>{e?.message} {location && JSON.stringify(e?.location?.start)}</div>
  }
}

export default ClazzItem;