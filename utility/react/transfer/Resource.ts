import {ResourceChangeSubscriber} from "./types"

export const enum ResourceStatus {
  Pending,
  Rejected,
  Resolved,
}

type ResourceData<T = any> = T | Promise<T> | null

export class Resource<T = any> {
  status: ResourceStatus
  _data: ResourceData<T>
  _subs = new Set<ResourceChangeSubscriber>()

  constructor(
    data: ResourceData<T> = null,
    status: ResourceStatus = ResourceStatus.Pending
  ) {
    this._data = data
    this.status = status
  }

  get data(): ResourceData<T> {
    return this._data
  }

  set data(value: ResourceData<T>) {
    this._data = value
    this._notifySubscribers()
  }

  clear(): void {
    this._data = null
    this._notifySubscribers()
  }

  subscribe(sub: ResourceChangeSubscriber) {
    this._subs.add(sub)
  }

  unsubscribe(sub: ResourceChangeSubscriber) {
    this._subs.delete(sub)
  }

  _notifySubscribers(): void {
    this._subs.forEach(s => s(this._data))
  }
}
