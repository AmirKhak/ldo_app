const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original
exports.addMessage = functions.https.onRequest((req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into the Realtime Database using the Firebase Admin SDK.
  return admin.database().ref('/messages').push({original: original}).then((snapshot) => {
    // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
    return res.redirect(303, snapshot.ref.toString());
  });
});

exports.toUpperCaseName = functions.firestore
    .document('user/{userId}')
    .onWrite((change, context) => {
      // Retrieve the current and previous value
      if (change.after.exists) {
        const data = change.after.data();
        console.log('firestore update',data);
        let name = data.name;
        return change.after.ref.set({
          name: name.toUpperCase()
        }, {merge: true});
      }
      return null;
    });


exports.NotifyFollowers = functions.firestore
    .document('user/{userId}')
    .onWrite((change, context) => {
      // Retrieve the current and previous value
      if (change.after.exists) {
        const users_ref = admin.firestore().collection('user');
        const pre_data = change.before.data();
        const data = change.after.data();
        let after_values = data.social.followers.values;
        let before_values = pre_data.social.followers.values;
        let changed_value;
        if (after_values.length !== before_values.length) {
          if (after_values.length > before_values.length) {
            changed_value = after_values[after_values.length-1];
            admin.firestore().collection('user').doc(changed_value).get().then(doc => {
                if (!doc.exists) {
                  console.log('No such document: ' + changed_value);
                  return null;
                } else {
                  console.log('firestore update', doc.data().name + " is added");
                  return null;
                }
              }).catch(err => {
                console.log('Error getting document', err);
              });
          } else {
            if (after_values[after_values.length-1] !== before_values[before_values.length-1]) {
              changed_value = before_values[before_values.length-1];
            }
            for (i = 0; i < after_values.length; i++) {
              if (after_values[i] !== before_values[i]) {
                changed_value = before_values[i];
              }
            }
            admin.firestore().collection('user').doc(changed_value).get().then(doc => {
                if (!doc.exists) {
                  console.log('No such document: ' + changed_value);
                  return null;
                } else {
                  console.log('firestore update', doc.data().name + " is removed");
                  return null;
                }
              })
              .catch(err => {
                console.log('Error getting document', err);
              });
          }
        } else {
          let changed_to;
          for (i = 0; i < after_values.length; i++) {
            if (after_values[i] !== before_values[i]) {
              changed_value = before_values[i];
              changed_to = after_values[i];
            }
          }
          admin.firestore().collection('user').doc(changed_to).get().then(doc => {
            let prev_doc = doc.data().name;
            admin.firestore().collection('user').doc(changed_value).get().then(doc => {
                if (!doc.exists) {
                  console.log('No such document: ' + changed_value);
                  return null;
                } else {
                  console.log('firestore update', prev_doc + " is replaced with " + doc.data().name);
                  return null;
                }
              })
              .catch(err => {
                console.log('Error getting document', err);
              });
            console.log('firestore update', doc.data().name + " is removed");
            return null;
          })
            .catch(err => {
              console.log('Error getting document', err);
            });
        }
      }
      return null;
    });
