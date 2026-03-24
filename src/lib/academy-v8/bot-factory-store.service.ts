import { BotProductRecord } from "./types"

export class BotFactoryStoreService {
  private static products: BotProductRecord[] = []

  static add(product: BotProductRecord) {
    this.products.unshift(product)
    return product
  }

  static list() {
    return [...this.products]
  }
}
