// For full API documentation, including code examples, visit http://wix.to/94BuAAs
import wixLocation from 'wix-location';
import {session} from 'wix-storage';

$w.onReady(function () {
	//TODO: write your page related code here...

  function getCurrentUser() {
    let currentUser = {email: session.getItem("cu_se_ie"),
      password: session.getItem("cu_se_dr")};
    return currentUser;
  }

  $w('#html1').onMessage((event, $w) => {
    let receivedMessage = event.data;
    handleSignOut(receivedMessage);
  });

  function print(message) {
	  $w('#text116').text = message;
  }

  function analyseMessage (message) {
    switch (message[0]) {
      case "ready":
        handleReady(message);
        break;
      case "sign-out":
        handleSignOut(message);
        break;
    }
  }

  function handleReady() {
    sendMessage('sign-out');
  }

  function handleSignOut(message) {
    switch (message[1]) {
      case "SUCCESS":
        print(message[2]);
        signOutUser();
        break;
      default:
        print(message[1]);
        break;
    }
    wixLocation.to("/test");
  }

  function signOutUser () {
    session.removeItem("cu_se_ie");
    session.removeItem("cu_se_dr");
  }

  if (getCurrentUser().email !== null) {
    $w('#html1').postMessage('sign-out');
  } else {
    wixLocation.to('/test');
  }

});
