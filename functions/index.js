const functions = require('firebase-functions');
const firebase = require('firebase');
var stripe = require("stripe")("sk_test_4eC39HqLyjWDarjtT1zdp7dc");
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

exports.createCustomer = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    console.log('User not authenticated!');
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    var request = {
      description: data.description,
      email: data.email
    };
    console.log(JSON.stringify(request));
    stripe.customers.create(request,
      function(err, customer) {
        if (err) {
          console.log("Failure: " + err.message);
          return err.message;
        }
        if (customer) {
          console.log("SUCCESS: Customer is added!");
          return customer;
        }
        console.log("No result")
        return request;
    });
  }
});

exports.createAccount = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    console.log('User not authenticated!');
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    var request = {
      type: data.type,
      country: data.country,
      email: data.email
    };
    stripe.accounts.create(request,
      function(err, account) {
        if (err) {
          console.log("Failure: " + err.message);
          return err.message;
        }
        if (account) {
          console.log("SUCCESS: Account is added!");
          return account;
        }
        console.log("No result")
        return request;
      });
  }
});

exports.saveCharge = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    console.log('User not authenticated!');
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    var charge = data.charge;
    return admin.firestore().collection('charges').add(charge).then(ref => {
      console.log('DATABASE CHANGE: ', 'document: ' + ref.id
        + ' , added to collection: charges');
      return {message: "Charge successfully saved!"};
    });
  }
});

exports.chargeCustomer = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    console.log('User not authenticated!');
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    var request = {
      amount: data.amount,
      currency: data.currency,
      source: data.source, // obtained with Stripe.js
      description: data.description
    };
    stripe.charges.create(request,
      function(err, charge) {
        if (err) {
          console.log("Failure: " + err.message);
          return err.message;
        }
        if (charge) {
          console.log("SUCCESS: Charge is added!");
          return charge;
        }
        console.log("No result")
        return request;
    });
  }
});


exports.addAccount = functions.https.onCall((data, context) => {
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    console.log('User not authenticated!');
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
      'while authenticated.');
  } else {
    var account = {
      experiences: {
        values: context.auth.token.values || []
      },
      interests: context.auth.token.interests || [],
      name: context.auth.token.name || null,
      profilepicture: context.auth.token.profilepicture || null,
      profiletype: context.auth.token.profiletype || 0,
      social: {
        followers: context.auth.token.followers || []
      },
      userId: context.auth.uid,
      work: {
        company: context.auth.token.company || null,
        job: context.auth.token.job || null
      }
    };
    return admin.firestore().collection('usersUAT').add(account).then(ref => {
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
      attendees: {
        values: context.auth.token.values || []
      },
      category: {
        values: context.auth.token.categories || []
      },
      dates: {
        values: context.auth.token.dates || []
      },
      description: context.auth.token.description || null,
      experienceID: context.auth.token.experienceID || null,
      host: {
        address: context.auth.token.host_address || null,
        name: context.auth.token.name || null,
        phone: context.auth.token.phone || null,
        postcode: context.auth.token.postcode || null,
        web: context.auth.token.web || null,
      },
      hostid: context.auth.uid,
      images: {
        values: context.auth.token.images || []
      },
      isActive: context.auth.token.isActive || true,
      location: {
        address: context.auth.token.location_address || null,
        city: context.auth.token.city || null,
        lat: context.auth.token.lat || null,
        long: context.auth.token.long || null,
        postcode: context.auth.token.postcode || null
      },
      prices: {
        values: context.auth.token.prices || []
      },
      reviews: {
        values: context.auth.token.reviews || []
      },
      title: context.auth.token.title || null
    };
    return admin.firestore().collection('experiencesUAT').add(event).then(ref => {
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

exports.hello = functions.https.onCall((data, context) => {
  //{name: req.headers.name}
  return {message: "hello World"};
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


    exports.sign_up = functions.https.onRequest((req, res) => {
      const email = req.body.email;
      const password = req.body.password;
      const displayName = req.body.displayName;
      if (!(email && password && displayName)) {
        res.status(400).send("email or password or name: " + email + ", " +
          password + ", " + displayName + ", " + JSON.stringify(req.body));
        return;
      }
      return admin.auth().createUser({
        email: req.body.email,
        emailVerified: req.body.emailVerified || false,
        phoneNumber: req.body.phoneNumber || null,
        password: req.body.password,
        displayName: req.body.displayName || null,
        photoURL: req.body.photoURL || null,
        disabled: req.body.disabled || false
      })
      .then(function(userRecord) {
        // See the UserRecord reference doc for the contents of userRecord.
        var account = {
          experiences: {
            values: req.body.values || []
          },
          interests: req.bodyinterests || [],
          name: req.body.displayName || null,
          profilepicture: req.body.profilepicture || null,
          profiletype: req.body.profiletype || 0,
          social: {
            followers: req.body.followers || []
          },
          userId: userRecord.uid,
          work: {
            company: req.body.company || null,
            job: req.body.job || null
          }
        };
        return admin.firestore().collection('accounts').add(account).then(ref => {
          res.status(200).send("Successfully created new user:", userRecord.uid);
          return;
        });
      })
      .catch(function(error) {
        res.status(400).send("Error creating new user:", error);
      });
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
