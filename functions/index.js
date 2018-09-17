const functions = require('firebase-functions');
const firebase = require('firebase');

const admin = require('firebase-admin');
const serviceAccount = require("./letsdayout-9783f-firebase-adminsdk-l8d0p-a4145c1100.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://letsdayout-9783f.firebaseio.com"
});

var db = admin.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true};
admin.firestore().settings(settings);

// Take the text parameter passed to this HTTP endpoint and insert it into the
// Realtime Database under the path /messages/:pushId/original

exports.parseUser = (req, res) => {
  res.status(200).send('The user is signed up.');
}

function addDocumentToDatabase(collection, data) {
  var documentRef = admin.firestore().collection(collection).add(data).then(ref => {
    console.log('DATABASE CHANGE: ', 'document: ' + ref.id + ' , collection: ' + collection);
    return ref;
  });
  return documentRef;
}

exports.addAccount = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    console.log('User not authenticated!');
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    var account = {
      uid: context.auth.uid,
      profile: {
        name: context.auth.token.name || null,
        picture: context.auth.token.picture || null,
        email: context.auth.token.email || null,
        city: context.auth.token.city || null,
        address: context.auth.token.address || null,
        phone: context.auth.token.phone || null
      },
      bank_detail: {
        holder_name: context.auth.token.holder_name || null,
        sort_code: context.auth.token.sort_code || null,
        account_number: context.auth.token.account_number || null
      }
    };
    return admin.firestore().collection('accounts').add(account).then(ref => {
      console.log('DATABASE CHANGE: ', 'document: ' + ref.id
        + ' , added to collection: accounts');
      return {message: "Account successfully added!"};
    });
  }
});

exports.addAttendee = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    console.log('User not authenticated!');
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    var attendee = {
      uid: context.auth.uid,
      eid: context.auth.token.eid || null,
      name: context.auth.token.name || null,
      photo: context.auth.token.photo || null,
      phone: context.auth.token.phone || null,
      email: context.auth.token.email || null
    };
    return admin.firestore().collection('attendees').add(attendee).then(ref => {
      console.log('DATABASE CHANGE: ', 'document: ' + ref.id
        + ' , added to collection: attendees');
      return {message: "Attendee successfully added!"};
    });
  }
});

exports.addEvent = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    console.log('User not authenticated!');
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    var event = {
      uid: context.auth.uid,
      event_details: {
        location: context.auth.token.holder_name || null,
        name: context.auth.token.holder_name || null,
        age_restriction: context.auth.token.holder_name || null,
        description: context.auth.token.holder_name || null,
        categories: context.auth.token.holder_name || null,
        photos: context.auth.token.holder_name || null,
        youtube_links: context.auth.token.holder_name || null,
        dates: context.auth.token.holder_name || null
      },
      bank_detail: {
        holder_name: context.auth.token.holder_name || null,
        sort_code: context.auth.token.sort_code || null,
        account_number: context.auth.token.account_number || null
      },
      host: {
        name: context.auth.token.name || null,
        email: context.auth.token.email || null,
        city: context.auth.token.city || null,
        address: context.auth.token.address || null,
        phone: context.auth.token.phone || null
      },
      ticketing: {
        max_num: context.auth.token.max_num || null,
        require_guest_name_phone: context.auth.token.require_guest_name_phone
          || null,
        tickets: context.auth.token.tickets || null
      }
    };
    return admin.firestore().collection('events').add(event).then(ref => {
      console.log('DATABASE CHANGE: ', 'document: ' + ref.id
        + ' , added to collection: events');
      return {message: "Event successfully added!"};
    });
  }
});

exports.getUserEvent = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    console.log('User not authenticated!');
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    const uid = context.auth.uid;
    return admin.firestore().collection('events').where('uid', '==', uid)
      .get().then(snapshot => {
        var events = [];
        snapshot.forEach(doc => {
          let event = JSON.stringify(doc.data());
          console.log(event);
          events.push(event);
        });
        console.log('All events fetched successfully!');
        return {events: events};
      }).catch(err => {
        console.log('Error getting documents', err);
      });
  }
});

exports.getUserAccount = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    console.log('User not authenticated!');
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    const uid = context.auth.uid;
    return admin.firestore().collection('account').where('uid', '==', uid)
      .get().then(snapshot => {
        var accounts = [];
        snapshot.forEach(doc => {
          let account = JSON.stringify(doc.data());
          console.log(account);
          accounts.push(account);
        });
        console.log('All accounts fetched successfully!');
        return {accounts: accounts};
      }).catch(err => {
        console.log('Error getting documents', err);
      });
  }
});

exports.getUserAttendees = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    console.log('User not authenticated!');
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    const uid = context.auth.uid;
    return admin.firestore().collection('attendees').where('uid', '==', uid)
      .get().then(snapshot => {
        var attendees = [];
        snapshot.forEach(doc => {
          let attendee = JSON.stringify(doc.data());
          console.log(attendee);
          attendees.push(attendee);
        });
        console.log('All attendees fetched successfully!');
        return {attendees: attendees};
      }).catch(err => {
        console.log('Error getting documents', err);
      });
  }
});

exports.getEventAttendees = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    console.log('User not authenticated!');
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    const uid = context.auth.uid;
    const eid = context.auth.token.eid;
    return admin.firestore().collection('attendees').where('eid', '==', eid)
      .get().then(snapshot => {
        var attendees = [];
        snapshot.forEach(doc => {
          let attendee = JSON.stringify(doc.data());
          console.log(attendee);
          attendees.push(attendee);
        });
        console.log('All attendees fetched successfully!');
        return {attendees: attendees};
      }).catch(err => {
        console.log('Error getting documents', err);
      });
  }
});

exports.getMyExperiences = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    console.log('User not authenticated!');
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    console.log('User is authenticated!');
    // Authentication / user information is automatically added to the request.
    const uid = context.auth.uid;
    const name = context.auth.token.name || null;
    const picture = context.auth.token.picture || null;
    const email = context.auth.token.email || null;

    return admin.firestore().collection('experiences').where('user_id', '==', uid)
      .get().then(snapshot => {
        var experiences = [];
        snapshot.forEach(doc => {
          let experience = [doc.data().title, doc.data().description, doc.data().user_name];
          console.log(experience);
          experiences.push(experience);
        });
        console.log('All experiences fetched successfully!');
        return {experiences: experiences};
      }).catch(err => {
        console.log('Error getting documents', err);
      });
  }
});

exports.getAllExperiences = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    console.log('User not authenticated!');
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    console.log('User is authenticated: ' + context.auth);
    // ...

    // Authentication / user information is automatically added to the request.
    const uid = context.auth.uid;
    const name = context.auth.token.name || null;
    const picture = context.auth.token.picture || null;
    const email = context.auth.token.email || null;


    return admin.firestore().collection('experiences').get().then(snapshot => {
      var experiences = [];
      snapshot.forEach(doc => {
        let experience = [doc.data().title, doc.data().description, doc.data().user_name];
        console.log(experience);
        experiences.push(experience);
      });
      console.log('All experiences fetched successfully!');
      return {experiences: experiences};
    }).catch(
    err => {
      console.log('Error getting documents', err);
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

exports.hello = functions.https.onRequest((req, res) => {
  //{name: req.headers.name}
  res.status(200).send([{name: "haya"}]);
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
