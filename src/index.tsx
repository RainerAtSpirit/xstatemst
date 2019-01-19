import { observer } from "mobx-react"
import { onSnapshot } from "mobx-state-tree"
import * as React from "react"
import { render } from "react-dom"
import { IStore, Store } from "./models/Store"

const machineDefinition = {
  initial: "idle",
  states: {
    idle: {
      on: {
        FETCH: "pending"
      }
    },
    pending: {
      onEntry: "fetchData",
      on: {
        FULFILL: "fulfilled",
        REJECT: "rejected"
      }
    },
    rejected: {
      onEntry: "showErrorMessage",
      on: {
        FETCH: "pending"
      }
    },
    fulfilled: {
      onEntry: "updateData"
    }
  }
}

const mstStore = Store.create({
  machineDefinition
})

// tslint:disable-next-line:no-console
onSnapshot(mstStore, snapshot => console.log("snapshot", snapshot))
export interface IAppProps {
  store: IStore
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

render(<App store={mstStore} />, document.getElementById("root"))
