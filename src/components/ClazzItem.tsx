import React from 'react'
import { json2dart } from '../utils/json2dart'
import { ParamInfo, LoopInfo } from '../entity/ClazzInfo'

interface ClazzProps {
  result: string
  clazzName: string
}
const ClazzItem: React.FC<ClazzProps> = ({ result, clazzName }) => {
  try {
    const { params, loop } = json2dart(result)
    return params ? <React.Fragment>
      <div><span className="blue">@JsonSerializable</span>()</div>
      {/* class */}
      <div><span className="blue">class </span><span className="green">{clazzName}</span> {'{'}</div>
      {/* params */}
      {params.map((ele: any) => <div key={ele.key}>  <span className="green">{ele.type}</span> {ele.key};</div>)}
      <br />
      {/* define */}
      <div><span className="green">  {clazzName}</span>{'({ '}{params.map((ele: ParamInfo) => <span key={ele.key}><span className="blue">this</span>.{ele.key}, </span>)}{'})'};</div>
      <br />
      <div><span className="blue">  factory </span><span className="green">{clazzName}</span>.<span className="yellow">fromJson</span>(<span className="green">Map&lt;String, dynamic&gt;</span> json) =&gt; <span className="green">_${clazzName}FromJson</span>(json);</div>
      <br />
      <div><span className="green">  Map&lt;String, dynamic&gt;</span><span className="yellow"> toJson</span>() =&gt; <span className="green">_${clazzName}ToJson</span>(<span className="blue">this</span>);</div>
      }
        <br />
      <br />
      {loop && loop.map((ele: LoopInfo, index: number) => <ClazzItem key={index} result={ele.json} clazzName={ele.clazz} />)}
    </React.Fragment> : null
  } catch (error) {
    return <div>{error}</div>
  }
}

export default ClazzItem;