import { NextPage } from 'next'
import Body from '../components/Body'

const IndexPage: NextPage = () => {
  return <div>
    <Body></Body>
    <style global jsx>{`
      body {
        padding: 0;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
            "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
            sans-serif;
        -webkit-font-smoothing: antialiased;
      }
    `}</style>
  </div>
}

export default IndexPage