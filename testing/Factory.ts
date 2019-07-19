type FactoryFunction<T extends object> = (id: number) => T

export class Factory<T extends object> {
  count = 1
  private makeObject: FactoryFunction<T>

  constructor(factoryFn: FactoryFunction<T>) {
    this.makeObject = factoryFn
  }

  make(args?: Partial<T>) {
    const id = this.count
    this.count += 1

    const obj = this.makeObject(id)
    return {...obj, ...args}
  }

  makeMany(quantity: number, ...args: Partial<T>[]) {
    const items = []
    for (let i = 0; i < quantity; i += 1) {
      const currentArgs = args[i] || []
      items.push(this.make(currentArgs))
    }
    return items
  }
}
