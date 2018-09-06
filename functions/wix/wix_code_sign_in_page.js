// For full API documentation, including code examples, visit http://wix.to/94BuAAs
import wixLocation from 'wix-location';
import {session} from 'wix-storage';

$w.onReady(function () {
	//TODO: write your page related code here...

  var temprorayUser = null;

  function getTemproraryUser() {
    return temprorayUser;
  }

  function setTemproraryUser(email, password) {
    let user = {email: email, password: password};
    temprorayUser = user;
  }

  function destroyTemprorayUser() {
    temprorayUser = null;
  }

  function getCurrentUser() {
    let currentUser = {email: session.getItem("cu_se_ie"),
      password: session.getItem("cu_se_dr")};
    return currentUser;
  }

  function getCurrentPageTitle() {
    return $w('#page1').title;
  }

  function isUserSignIn () {
    getCurrentUser() !== null;
  }

  function signOutUser () {
    session.removeItem("cu_se_ie");
    session.removeItem("cu_se_dr");
  }

  function setCurrentUser (email, password) {
    session.setItem("cu_se_ie", email);
    session.setItem("cu_se_dr", password);
  }

  function signInUser(email, password) {
    let user = ['sign-in', email, password];
    setTemproraryUser(email, password);
    $w('#html1').postMessage(user);
  }

  function analyseMessage (message) {
	  switch (message[0]) {
		  case "sign-in":
		    handleSignIn(message);
			  break;
		  case "sign-up":
		    handleSignUp(message);
			  break;
		  case "sign-out":
		    handleSignOut(message);
			  break;
		  case "ready":
		    handleReady(message);
			  break;
		  case "addExperience":
		    handleAddExperience(message);
			  break;
		  case "getExperiences":
		    handleGetExperiences(message);
			  break;
		  case "getAllExperiences":
		    handleGetAllExperiences(message);
			  break;
	  }
  }

  function handleSignIn (message) {
	  if (message[1] === "SUCCESS") {
      let user = getTemproraryUser();
      setCurrentUser(user.email, user.password);
      print("User has signed up successfully.");
      wixLocation.to("/userpage");
    } else {
      print(message[1]);
    }
    destroyTemprorayUser();
  }

  function handleSignOut (message) {

  }

  function handleAddExperience (message) {

  }

  function handleGetAllExperiences (message) {

  }

  function handleReady (message) {

  }

  function handleGetExperiences (message) {

  }

  function handleSignUp (message) {

  }

  function print(message) {
	  $w('#text116').text = message;
  }

  let htmlId = '#html1';
  //print(($w(htmlId)===null).toString());
  print(($w(htmlId).id));
  $w('#button19').onClick( (event, $w) => {
      $w(htmlId).postMessage("sign-out");
      let email = $w('#input1').value;
      let password = $w('#input2').value;
      signInUser(email, password);
  });

  $w('#html1').onMessage((event, $w) => {
    let receivedMessage = event.data;
    analyseMessage(receivedMessage);
  });

});
