import produce from "immer"
import { assign, interpret, Machine, MachineConfig } from "xstate"

// let's do it "by the book" https://xstate.js.org/docs/guides/typescript.html :)

export interface IPromiseMachineSchema {
  states: {
    idle: {}
    pending: {}
    rejected: {}
    fulfilled: {}
  }
}

export type PromiseMachineEvents =
  | { type: "FETCH" }
  | { type: "FULFILL"; data: string[] }
  | { type: "REJECT"; message: string }

export interface IPromiseMachineContext {
  data: string[]
  message: string
}

export const machineConfig: MachineConfig<
  IPromiseMachineContext,
  IPromiseMachineSchema,
  PromiseMachineEvents
> = {
  initial: "idle",
  id: "promiseMachine",
  context: {
    data: [],
    message: ""
  },
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
      onEntry: "updateContext",
      on: {
        FETCH: "pending"
      }
    },
    fulfilled: {
      onEntry: "updateContext"
    }
  }
}

export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const machine = Machine<
  IPromiseMachineContext,
  IPromiseMachineSchema,
  PromiseMachineEvents
>(machineConfig, {
  actions: {
    fetchData: async function fetchData(ctx, event) {
      const success = Math.random() < 0.5

      await delay(2000)
      if (success) {
        // service is a singleton that will be started/stopped within <App>
        service.send({
          type: "FULFILL",
          data: ["foo", "bar", "baz"]
        })
      } else {
        service.send({ type: "REJECT", message: "No luck today" })
      }
    },
    updateContext: assign((ctx, event) =>
      produce(ctx, draft => {
        switch (event.type) {
          case "FULFILL":
            draft.data = event.data
            draft.message = ""
            break
          case "REJECT":
            draft.message = event.message
            break
        }
      })
    )
  }
})

export const service = interpret(machine)
