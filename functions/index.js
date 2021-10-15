/* eslint-disable */

// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

// When date is changed, push the visit ID to the associated day
// When employee or customer is changed, push the visit ID to the associated day
exports.onVisitUpdate = functions.firestore
  .document("/companies/{companyID}/visits/{visitID}")
  .onUpdate((change, context) => {
    const newVisit = change.after.data();
    const previousVisit = change.before.data();

    // Handle all cases of changed dates
    if (newVisit.data.date == oldVisit.data.date)
      functions.logger.log(newVisit, previousVisit);
  });

// Delete associated day(s) if necessary
exports.onVisitDelete = functions.firestore
  .document("/companies/{companyID}/visits/{visitID}")
  .onDelete();

// Create a final cloud function to perform regular sanitization of days that no longer contain any content
