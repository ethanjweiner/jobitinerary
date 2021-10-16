/* eslint-disable */

// The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// Helpers
function toWords(input) {
  const regex = /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|\d+/g;

  return input.trim().match(regex);
}

function nameToID(name) {
  const words = toWords(name);
  return words.map((word) => word.toLowerCase()).join("_");
}

function idToName(id) {
  return id
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const addVisitToEmployeeDay = async (date, companyID, employeeID, visitID) => {
  const dayRef = db.doc(
    `companies/${companyID}/employees/${employeeID}/days/${date}`
  );
  const dayDoc = await dayRef.get();
  // Create the day if it doesn't exist
  if (dayDoc.exists) {
    await dayRef.update({
      visitIDs: admin.firestore.FieldValue.arrayUnion(visitID),
    });
  } else {
    const hourlyRate = (
      await db.doc(`companies/${companyID}/employees/${employeeID}`).get()
    ).data().data.defaultHourlyRate;
    // Initialize a new day
    await dayRef.set({
      data: {
        date,
        companyID,
        employeeName: idToName(employeeID),
        startLocation: "",
        plannedStart: "",
        plannedEnd: "",
        time: {
          start: "",
          end: "",
          hours: 0,
        },
        notes: "",
        paid: false,
        hourlyRate,
        readByEmployee: false,
        readByCompany: false,
      },
      keywords: [""],
      visitIDs: [visitID],
    });
  }
};

// Check for conditions that indicate that no work was, or is being performed on that day (i.e. that the day shouldn't be searchable)
const dayIsEmpty = async (dayDoc) => {
  const data = dayDoc.data();

  return (
    !data.visitIDs.length &&
    !data.data.plannedStart &&
    !data.data.plannedEnd &&
    !data.data.startLocation &&
    !data.data.time.start &&
    !data.data.time.end &&
    !data.data.time.hours
  );
};

const removeVisitFromEmployeeDay = async (
  date,
  companyID,
  employeeID,
  visitID
) => {
  const dayRef = db.doc(
    `companies/${companyID}/employees/${employeeID}/days/${date}`
  );
  const dayDoc = await dayRef.get();

  // Remove the visit
  if (dayDoc.exists) {
    await dayRef.update({
      visitIDs: admin.firestore.FieldValue.arrayRemove(visitID),
    });
  }

  if (dayIsEmpty(dayDoc)) await dayRef.delete();
};

const handleDateChanges = async (newVisit, oldVisit, companyID, visitID) => {
  if (newVisit.data.date !== oldVisit.data.date) {
    if (newVisit.data.employeeName) {
      // Update the employee day, and create if nonexistent
      await addVisitToEmployeeDay(
        newVisit.data.date,
        companyID,
        nameToID(newVisit.data.employeeName),
        visitID
      );
      // Remove the visit from the old day
      await removeVisitFromEmployeeDay(
        oldVisit.data.date,
        companyID,
        nameToID(newVisit.data.employeeName),
        visitID
      );
    }
    if (newVisit.data.customerName) {
      // Update the customer day, and create if nonexistent
    }
  }
};

const handleEmployeeChanges = async (
  newVisit,
  oldVisit,
  companyID,
  visitID
) => {
  if (
    newVisit.data.employeeName != oldVisit.data.employeeName &&
    newVisit.data.date
  ) {
    // Update the employee day, and create if nonexistent
    if (newVisit.data.employeeName) {
      await addVisitToEmployeeDay(
        newVisit.data.date,
        companyID,
        nameToID(newVisit.data.employeeName),
        visitID
      );
    }

    if (oldVisit.data.employeeName) {
      await removeVisitFromEmployeeDay(
        newVisit.data.date,
        companyID,
        nameToID(oldVisit.data.employeeName),
        visitID
      );
    }
  }
};
const handleCustomerChanges = async (
  newVisit,
  oldVisit,
  companyID,
  visitID
) => {
  if (
    newVisit.data.customerName != oldVisit.data.customerName &&
    newVisit.data.date
  ) {
    // Update the customer day, and create if nonexistent
  }
};

// When date is changed, push the visit ID to the associated day
// When employee or customer is changed, push the visit ID to the associated day
exports.onVisitUpdate = functions.firestore
  .document("/companies/{companyID}/visits/{visitID}")
  .onUpdate((change, context) => {
    const newVisit = change.after.data();
    const oldVisit = change.before.data();

    const companyID = context.params.companyID;
    const visitID = context.params.visitID;

    return new Promise((resolve) => {
      handleDateChanges(newVisit, oldVisit, companyID, visitID)
        .then(() => {
          handleEmployeeChanges(newVisit, oldVisit, companyID, visitID);
        })
        .then(() => {
          handleCustomerChanges(newVisit, oldVisit, companyID, visitID);
        })
        .then(resolve);
    });
  });

exports.onVisitCreate = functions.firestore
  .document("/companies/{companyID}/visits/{visitID}")
  .onCreate((snapshot, context) => {
    const visit = snapshot.data();

    const companyID = context.params.companyID;
    const visitID = context.params.visitID;

    return new Promise((resolve) => {
      if (visit.data.employeeName && visit.data.date) {
        addVisitToEmployeeDay(
          visit.data.date,
          companyID,
          nameToID(visit.data.employeeName),
          visitID
        ).then(resolve);
      }
      resolve();
    });
  });

// Delete associated day(s) if necessary
exports.onVisitDelete = functions.firestore
  .document("/companies/{companyID}/visits/{visitID}")
  .onDelete((snapshot, context) => {
    // Remove the visit from the visit ids
    const visit = snapshot.data();

    const companyID = context.params.companyID;
    const visitID = context.params.visitID;

    return new Promise((resolve) => {
      if (visit.data.date && visit.data.employeeName) {
        removeVisitFromEmployeeDay(
          visit.data.date,
          companyID,
          nameToID(visit.data.employeeName),
          visitID
        ).then(resolve);
      }
      if (visit.data.date && visit.data.customerName) {
        // Remove visit from customer day
      }
      resolve();
    });
  });

// Create a final cloud function to perform regular sanitization of days that no longer contain any content
