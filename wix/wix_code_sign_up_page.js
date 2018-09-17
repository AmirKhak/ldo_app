import wixLocation from 'wix-location';
import {session} from 'wix-storage';

$w.onReady(function () {

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

  function setCurrentUser (email, password) {
    session.setItem("cu_se_ie", email);
    session.setItem("cu_se_dr", password);
  }

  function get(item) {
    switch (item) {
      case "topText":
        return $w('#text116');
      case "submitBtn":
        return $w('#button19');
      case "nameInput":
        return $w('#input1');
      case "emailInput":
        return $w('#input2');
      case "passeordInput":
        return $w('#input3');
      case "page":
        return $w('#page1');
      case "html":
        return $w('#html1');
      default:
        return null;
    }
  }

  function getCurrentUser() {
    let currentUser = {email: session.getItem("cu_se_ie"),
      password: session.getItem("cu_se_dr")};
    return currentUser;
  }

  function analyseMessage (message) {
    switch (message[0]) {
      case "sign-up":
        handleSignUp(message);
        break;
    }
  }

  function handleSignUp(message) {
    let res = message[1];
    if (res === "SUCCESS") {
      let user = getTemproraryUser();
      setTemproraryUser(user.email, user.password);
      wixLocation.to('/userpage');
    }
    destroyTemprorayUser();
    get('topText').text = res;
  }

  function signUpUser() {
    let email = get('emailInput').value;
    let password = get('passwordInput').value;
    setTemproraryUser(email, password);
    let message = ['sign-up', email, password, get('nameInput').value];
    sendMessage(message);
  }

  function sendMessage(message) {
    get('html').postMessage(message);
  }

  //END OF FUNCTION AREA

  get('html').onMessage((event, $w) => {
    let receivedMessage = event.data;
    analyseMessage(receivedMessage);
  })

  if (getCurrentUser().email !== null) {
    wixLocation.to('/userpage');
  }

})
