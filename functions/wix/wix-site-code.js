// For full API documentation, including code examples, visit http://wix.to/94BuAAs
import wixLocation from 'wix-location';
import {session} from 'wix-storage';

$w.onReady(function () {
	//TODO: write your page related code here...
  // var user = null;
  // $w('#text116').text = "Haya";

  function  getCurrentUser() {
    let currentUser = {email: session.getItem("cu_se_ie"),
      password: session.getItem("cu_se_dr")};
    return currentUser;
  }

  function isUserAuthenticated() {
    let currentUser = getCurrentUser();
    return currentUser.email === null || currentUser.password === null;
  }

  function getCurrentPageTitle() {
    return $w('#page1').title;
  }

  if (getCurrentPageTitle() !== "Sign out" && isUserAuthenticated()) {
    wixLocation.to("/signoutpage");
  }

  // $w('#html1').onMessage((event, $w) => {
  //   let receivedMessage = event.data;
  // 	 $w('#text116').text = receivedMessage;
  // });
});
