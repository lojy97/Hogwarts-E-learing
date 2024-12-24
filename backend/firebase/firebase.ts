import * as admin from "firebase-admin";

import * as serviceAccount from "./firebase-service-accountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});

export default admin;