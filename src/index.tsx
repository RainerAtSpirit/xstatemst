import * as React from "react"
import { render } from "react-dom"
import { interpret } from "xstate"
import { machine, service } from "./machines/PromiseMachine"

class App extends React.Component {
  public state = {
    current: machine.initialState
  }

  public service = service.onTransition(current => {
    this.setState({ current })
  })

  public componentDidMount() {
    this.service.start()
  }

  public componentWillUnmount() {
    this.service.stop()
  }

  public render() {
    ;(window as any).service = this.service
    const { current } = this.state
    const { send } = this.service
    const handleClick = () => send("FETCH")

    return (
      <div>
        <button onClick={handleClick}>fetch</button>
        {JSON.stringify(this.state.current.context, null, 2)}
        {JSON.stringify(this.state.current.value, null, 2)}
      </div>
    )
  }
}

render(<App />, document.getElementById("root"))
