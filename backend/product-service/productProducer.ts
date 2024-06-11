import { producer } from './kafkaConfig';
import { IProduct } from './ProductModel';

function AddToCartEvent(product: IProduct, userId: string) {
    const message = {
        product,
        userId
    };
    
    producer.send([{ topic: 'product-created', messages: [JSON.stringify(message)] }], function (err, data) {
        if (err) {
            console.error('Error sending product created event:', err);
        } else {
            console.log('Product created event sent:', data);
        }
    });
}

export { AddToCartEvent };
