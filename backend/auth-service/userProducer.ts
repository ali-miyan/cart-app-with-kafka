import { producer } from './kafkaConfig';
import {userModel} from './UserModel'

function sendUserCreatedEvent(user:userModel) {
    producer.send([{ topic: 'user-created', messages: [JSON.stringify(user)] }], function (err, data) {
        if (err) {
            console.error('Error sending user created event:', err);
        } else {
            console.log('user created event sent:', data);
        }
    });
}

export { sendUserCreatedEvent };