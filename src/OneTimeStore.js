export default class OneTimeStore {
  constructor() {
    this.store = {}
    this.ref = 0
  }

  set(data) {
    this.ref++
    if (this.ref === Number.MAX_SAFE_INTEGER) this.ref = 0
    this.store[this.ref] = data
    return this.ref
  }

  get(ref) {
    const data = this.store[ref]
    delete this.store[ref]
    return data
  }
}