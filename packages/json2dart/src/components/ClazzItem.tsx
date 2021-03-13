import React from 'react'
import { json2dart } from '../utils/json2dart'
import { LoopInfo, ParamInfo } from '../entity/ClazzInfo'
import { AstNode } from '@j2a/core/dist/index'

interface ClazzProps {
  result?: string
  ast?: AstNode
  clazzName: string
}
const ClazzItem: React.FC<ClazzProps> = ({ result, ast, clazzName }) => {
  try {
    const { params, loop }: { params: ParamInfo[], loop: LoopInfo[] } = json2dart({ result, ast })
    return params ? <>
      <div><span className="blue">@JsonSerializable</span>()</div>
      {/* class */}
      <div><span className="blue">class </span><span className="green">{clazzName}</span> {'{'}</div>
      {/* params */}
      {params.map((ele: ParamInfo, idx: number) => <div key={ele.key + idx}>  <span className="green">{ele.type}</span> {ele.key};{ele.comment && <span className="red"> // {ele.comment}</span>}</div>)}
      <br />
      {/* define */}
      <div><span className="green">  {clazzName}</span>{'({ '}{params.map((ele: ParamInfo, idx) => <span key={ele.key + idx}><span className="blue">this</span>.{ele.key}, </span>)}{'})'};</div>
      <br />
      <div><span className="blue">  factory </span><span className="green">{clazzName}</span>.<span className="yellow">fromJson</span>(<span className="green">Map&lt;String, dynamic&gt;</span> json) =&gt; <span className="green">_${clazzName}FromJson</span>(json);</div>
      <br />
      <div><span className="green">  Map&lt;String, dynamic&gt;</span><span className="yellow"> toJson</span>() =&gt; <span className="green">_${clazzName}ToJson</span>(<span className="blue">this</span>);</div>
      &rbrace;
      <br />
      <br />
      {loop && loop.map((ele: LoopInfo, index: number) => <ClazzItem key={index} ast={ele.node} clazzName={ele.clazz} />)}
    </> : null
  } catch ({ message, location }) {
    return <div>{message} {JSON.stringify(location.start)}</div>
  }
}

export default ClazzItem;