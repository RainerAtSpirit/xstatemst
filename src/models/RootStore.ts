import { Instance, types } from "mobx-state-tree"
import { Machine } from "xstate"
import { createXStateAble } from "./createXStateAble"

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

export const RootStore = types.compose(
  "RootStore",
  types
    .model({
      data: types.optional(types.frozen(), null),
      message: types.optional(types.string, "")
    })
    .views(self => ({
      get result() {
        return {
          data: self.data,
          message: self.message
        }
      }
    }))
    .actions((self: any) => ({
      fetchData() {
        setTimeout(() => {
          const success = Math.random() < 0.5

          if (success) {
            self.service.send({
              type: "FULFILL",
              data: ["foo", "bar", "baz"]
            })
          } else {
            self.service.send({ type: "REJECT", message: "No luck today" })
          }
        }, 2000)
      },

      updateData(context: any, event: any) {
        self.message = event.message || ""
        self.data = event.data
      },

      showErrorMessage(context: any, event: any) {
        self.message = event.message
      }
    }))
    .volatile((self: any) => ({
      machine: Machine(self.machineDefinition, {
        actions: {
          fetchData: self.fetchData,
          updateData: self.updateData,
          showErrorMessage: self.showErrorMessage
        }
      })
    })),
  createXStateAble({ machineDefinition })
)

export interface IRootStore extends Instance<typeof RootStore> {}

export const rootStore = RootStore.create({})
