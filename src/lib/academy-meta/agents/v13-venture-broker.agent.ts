import { productPromotionService } from '../services/product-promotion-service';
export class V13VentureBrokerAgent { constructor() {} async execute(productId: string) { return productPromotionService.promoteValidatedProduct(productId); } }
export const v13VentureBrokerAgent = new V13VentureBrokerAgent();