const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.helloWorld = (req, res) => {
  if (req.body.message === undefined) {
    // This is an error case, as "message" is required
    res.status(400).send('No message defined!');
  } else {
    // Everything is ok - call request-terminating method to signal function
    // completion. (Otherwise, the function may continue to run until timeout.)
    console.log(req.body.message);
    res.status(200).end();
  }
};
