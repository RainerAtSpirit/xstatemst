import { Instance, types } from "mobx-state-tree"
import { Machine } from "xstate"
import { interpret } from "xstate/lib/interpreter"

export const createXStateAble = (machineDefinition: any, config: any) => {
  const machine = Machine(machineDefinition, config)

  const XStateable = types
    .model("XStateable", {
      machineDefinition: types.frozen(),
      value: types.optional(types.string, ""),
      nextEvents: types.array(types.string)
    })
    .volatile((self: any) => ({
      machine
    }))
    .volatile((self: any) => ({
      service: interpret(self.machine).onTransition(state => {
        self.setValue(state.value)
        self.setNextEvents(state.nextEvents)
      })
    }))
    .actions((self: any) => ({
      setValue(value: string) {
        self.value = value
      },
      setNextEvents(nextEvents: any) {
        self.nextEvents = nextEvents
      },
      afterCreate() {
        self.value = self.machine.initialState.value
        self.service.start()
      }
    }))

  const xstate = ((window as any).xstate = XStateable.create({
    machineDefinition
  }))

  return xstate
}
