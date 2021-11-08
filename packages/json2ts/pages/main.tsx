
import { StrictMode } from 'react'
import { render } from 'react-dom'
import IndexPage from '.'

render(
  <StrictMode>
    <IndexPage />
  </StrictMode>,
  document.getElementById('root')
)
