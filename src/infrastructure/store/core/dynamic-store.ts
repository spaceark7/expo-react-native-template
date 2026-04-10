export interface DynamicStoreActions {
}
export type DynamicStoreOptions = {
} & Record<string, unknown>

  const createDynamicStore<T, DynamicStoreActions, DynamicStoreOptions >() => {}