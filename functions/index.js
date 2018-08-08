const functions = require('firebase-functions');
const firebase = require('firebase');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// {
//   projectId: 'new-app-233e1',
//   clientEmail: 'firebase-adminsdk-7tbcd@new-app-233e1.iam.gserviceaccount.com',
//   privateKey: '-----BEGIN PRIVATE // }
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
const serviceAccount = require("./new-app-233e1-firebase-adminsdk-7tbcd-a2348dcce9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://new-app-233e1.firebaseio.com"
});

var db = admin.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
admin.firestore().settings(settings);

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original

exports.parseUser = (req, res) => {
  res.status(200).send('The user is signed up.');
}

// switch (req.get('content-type')) {
//   // '{"name":"John"}'
//   case 'application/json':
//     user_body = req.body;
//     break;
//
//   // 'John', stored in a Buffer
//   case 'application/octet-stream':
//     user_body = req.body; // Convert buffer to a string
//     break;
//
//   // 'John'
//   case 'text/plain':
//     user_body = req.body;
//     break;
//
//   // 'name=John' in the body of a POST request (not the URL)
//   case 'application/x-www-form-urlencoded':
//     user_body = req.body;
//     break;
// }
// let user = admin.firestore().collection('user').add({
//   name: req.body.name,
//   username: req.body.username,
//   password: req.body.password
// }).then(ref => {
//   console.log('Added document with ID: ', ref.id);
//   return null;
// })
// .catch(err => {
//   console.log('Error getting document', err);
// });


function addDocumentToDatabase(collection, data) {
  var documentRef = admin.firestore().collection(collection).add(data).then(ref => {
    console.log('DATABASE CHANGE: ', 'document: ' + ref.id + ' , collection: ' + collection);
    return ref;
  });
  return documentRef;
}

exports.getAllExperiences = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    console.log('User not authenticated!');
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    console.log('User is authenticated!');
    // ...

    // Authentication / user information is automatically added to the request.
    const uid = context.auth.uid;
    const name = context.auth.token.name || null;
    const picture = context.auth.token.picture || null;
    const email = context.auth.token.email || null;


    return admin.firestore().collection('experiences').get().then(snapshot => {
      var experiences = [];
      snapshot.forEach(doc => {
        console.log(doc.data());
        experiences.push(doc.data());
      });
      console.log('All experiences fetched successfully!');
      return {experiences: experiences};
    });
  }
});

exports.addExperience = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    console.log('User not authenticated!');
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    console.log('User is authenticated!');
    // ...
    const text = data.text;

    // Authentication / user information is automatically added to the request.
    const uid = context.auth.uid;
    const name = context.auth.token.name || null;
    const picture = context.auth.token.picture || null;
    const email = context.auth.token.email || null;
    var experience = {
      user_name: name,
      user_id: uid,
      title: data.title,
      description: data.description
    }

    return admin.firestore().collection('experiences').add(experience).then(ref => {
      console.log('DATABASE CHANGE: ', 'document: ' + ref.id + ' , collection: ' + 'experiences');
      return {message: "Experience successfully added!"};
    });
  }
});

exports.signUpUser = functions.https.onRequest((req, res) => {

  var data = {
    name: req.body.name,
    username: req.body.username,
    password: req.body.password,
    social: {
      followers: {
        values: []
      }
    }
  };

  var user = admin.firestore().collection('user').add(data).then(ref => {
    console.log('DATABASE CHANGE: ', 'document: ' + ref.id + ' , collection: ' + 'user');
    res.status(200).send('The user is signed up.');
    return null;
  });
});

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
