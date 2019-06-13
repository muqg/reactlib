type FactoryFunction<T extends object, A extends any[]> = (
  id: number,
  ...args: A
) => T

export class Factory<T extends object, A extends any[] = any[]> {
  count = 1
  private makeObject: FactoryFunction<T, A>

  constructor(factoryFn: FactoryFunction<T, A>) {
    this.makeObject = factoryFn
  }

  make(...args: A) {
    const id = this.count
    this.count += 1

    return this.makeObject(id, ...args)
  }

  makeMany(quantity: number, ...args: A[]) {
    const items = []
    for (let i = 0; i < quantity; i += 1) {
      const currentArgs = args[i] || []
      items.push(this.make(...currentArgs))
    }
    return items
  }
}
