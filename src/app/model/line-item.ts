import { Product } from "./product";
import { Request } from "./request";

export class LineItem {
    id: number;
    requestId: number;
    productId: number;
    request: Request;
    product: Product;
    quantity: number;

    constructor(id: number = 0,
        requestId: number = 0,
        productId: number = 0,
        request: Request = new Request(),
        product: Product = new Product(),
        quantity: number = 0) {
        this.id = id;
        this.requestId = requestId;
        this.productId = productId
        this.request = request;
        this.product = product;
        this.quantity = quantity;
    }
}
