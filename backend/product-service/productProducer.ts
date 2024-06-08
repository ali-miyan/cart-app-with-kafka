import { producer } from './kafkaConfig';
import { IProduct } from './ProductModel';

function sendProductCreatedEvent(product:IProduct) {
    producer.send([{ topic: 'product-created', messages: [JSON.stringify(product)] }], function (err, data) {
        if (err) {
            console.error('Error sending product created event:', err);
        } else {
            console.log('Product created event sent:', data);
        }
    });
}

export { sendProductCreatedEvent };
