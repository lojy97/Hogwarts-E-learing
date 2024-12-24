import * as firebaseAdmin from './firebase';
import { WebpushNotification, Message, MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";

export async function sendNotification(tokens: string | string[], notification: WebpushNotification, link?: string) {
    try {
        let webpush = {
            notification,
            fcmOptions: { link: link ? link : 'http://localhost:3000' }
        }
        let message: Message | MulticastMessage;
        if (tokens && Array.isArray(tokens) && tokens.length > 0) {
            message = {
                tokens, webpush
            };
           await firebaseAdmin.default.messaging().sendEachForMulticast(message)
        }
        else if (tokens && tokens != '') {
            message = {
                token: tokens as string, webpush
            }
           await firebaseAdmin.default.messaging().send(message);
        }
    }
    catch (error) {
        console.log(error);
        console.log("couldn't send a notification to the user with token " + tokens);
    }
}