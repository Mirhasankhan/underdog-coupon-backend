import admin from "firebase-admin";
import { service_account } from "../config/serviceAccount";


admin.initializeApp({
  credential: admin.credential.cert(service_account as any),
});

export default admin;