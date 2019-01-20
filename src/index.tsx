import { observer } from "mobx-react"
import { Instance, onSnapshot } from "mobx-state-tree"
import * as React from "react"
import { render } from "react-dom"

import { IRootStore, rootStore } from "./models/RootStore"

// tslint:disable-next-line:no-console
onSnapshot(rootStore, snapshot => console.log("snapshot", snapshot))
export interface IAppProps {
  store: IRootStore
}

const App: React.SFC<IAppProps> = observer(({ store, ...props }: IAppProps) => {
  const handleOnClick = () => store.service.send("FETCH")
  return (
    <div>
      <button onClick={handleOnClick}>fetch</button>
      <div>
        {JSON.stringify(store.appState, null, 2)}
        {JSON.stringify(store.result, null, 2)}
      </div>
    </div>
  )
})

render(<App store={rootStore} />, document.getElementById("root"))
