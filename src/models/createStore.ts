import { IAnyModelType, Instance, types } from "mobx-state-tree"
import { createXStateAble } from "./createXStateAble"

export interface ICreateStoreProps<IT> {
  storeName: string
  Model: IT
  machineDefinition: object
}

export const createStore = <IT extends IAnyModelType>({
  storeName,
  Model,
  machineDefinition
}: ICreateStoreProps<IT>) => {
  const Store = types.compose(
    storeName,
    types.model({}),
    Model,
    createXStateAble({ machineDefinition }),
  )

  return Store
}
