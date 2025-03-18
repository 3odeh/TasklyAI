const admin = require("firebase-admin");
const serviceAccount = require("../database/firebase-config.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "your-firebase-storage-bucket-url"
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

module.exports = { admin, db, bucket };
