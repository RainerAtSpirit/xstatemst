import { Instance, types } from "mobx-state-tree";
import { interpret } from "xstate/lib/interpreter";

export const XStateable = types
  .model("XStateable", {
    machineDefinition: types.frozen(),
    appState: types.optional(types.string, "")
  })
  .volatile((self: any) => ({
    service: interpret(self.machine).onTransition(appState => {
      self.setAppState(appState.value);
    })
  }))
  .actions((self: any) => ({
    setAppState(appState: any) {
      self.appState = appState;
    },
    afterCreate() {
      self.appState = self.machine.initialState.value;
      self.service.start();
    }
  }));

  export interface IXStateable extends Instance<typeof XStateable> {}
