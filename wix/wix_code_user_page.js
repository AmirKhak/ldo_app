import wixLocation from 'wix-location';
import {session} from 'wix-storage';

$w.onReady(function () {

  function get(item) {
    switch (item) {
      case "addFormTopText":
        return $w('#text119');
      case "submitBtn":
        return $w('#button22');
      case "doneBtn":
        return $w('#button23');
      case "titleInput":
        return $w('#input1');
      case "descInput":
        return $w('#input2');
      case "collapseBtn":
        return $w('#button20');
      case "topText":
        return $w('#text116');
      case "addBtn":
        return $w('#button21');
      case "experiencesText":
        return $w('#text117');
      case "experienceHeaderText":
        return $w('#text118');
      case "page":
        return $w('#page1');
      case "html":
        return $w('#html1');
      default:
        return null;
    }
  }

  function expandAddForm() {
    get('addFormTopText').expand();
    get('titleInput').expand();
    get('descInput').expand();
    get('submitBtn').expand();
    get('doneBtn').expand();
  }

  function collapseAddForm() {
    get('addFormTopText').collapse();
    get('titleInput').collapse();
    get('descInput').collapse();
    get('submitBtn').collapse();
    get('doneBtn').collapse();
  }

  function getCurrentUser() {
    let currentUser = {email: session.getItem("cu_se_ie"),
      password: session.getItem("cu_se_dr")};
    return currentUser;
  }

  function analyseMessage (message) {
    switch (message[0]) {
      case "ready":
  	    handleReady(message);
        break;
      case "sign-in":
  	    handleSignIn(message);
        break;
      case "add-experience":
        handleAddExperience(message);
        break;
      case "get-user-experiences":
        handleGetExperiences(message);
        break;
    }
  }

  function handleSignIn(message) {
    if (message[1] !== "SUCCESS") {
      wixLocation.to('/test');
    }
  }

  function handleAddExperience(message) {
    let res = message[1];
    if (res === "SUCCESS") {
      res = message[2];
      sendMessage('get-user-experiences');
    }
    get('addFormTopText').text = res;
  }

  function handleGetExperiences(message) {
    let res = message[1];
    if (res === "SUCCESS") {
      res = constructExperiencesResult(message[2]);
    }
    get('experiencesText').text = res;
  }

  function constructExperiencesResult(experiences) {
    if (experiences.length === 0) {
      return "No Experiences";
    }
    let res = "";
    let i;
    for (i = 0; i < experiences.length; i++) {
      res = res + "  TITLE " + experiences[i][0] + "\n" +
        "  DESCRIPTION " + experiences[i][1] + "\n\n";
    }
    return res;
  }

  function sendMessage(message) {
    get('html').postMessage(message);
  }

  function getUserExperiences() {
    sendMessage("get-user-experiences");
  }

  function addNewExperience() {
    let message = ["add-experience", get('titleInput').value,
      get('descInput').value];
    sendMessage(message);
  }

  function handleReady() {
    get('experiencesText').text = "Fetching data";
    sendMessage('get-user-experiences');
  }

  //END OF FUNCTION AREA

  get('collapseBtn').onClick((event, $w) => {
    let experiencesText = get('experiencesText');
    let collapseBtn = get('collapseBtn');
    if (experiencesText.collapsed) {
      experiencesText.expand();
      collapseBtn.label = "Collapse";
    } else {
      experiencesText.collapse();
      collapseBtn.label = "Expand";
    }
  })

  get('addBtn').onClick((event, $w) => {
    expandAddForm();
  })

  get('doneBtn').onClick((event, $w) => {
    collapseAddForm();
  })

  get('submitBtn').onClick((event, $w) => {
    addNewExperience();
  })

  get('html').onMessage((event, $w) => {
    let receivedMessage = event.data;
    analyseMessage(receivedMessage);
  })

  let user = getCurrentUser();

  if (user !== null) {
    sendMessage(['sign-in', user.email, user.password]);
  }

  collapseAddForm();
  $w('#text120').text = "Session status: \n" + "Email: " + user.email + "\n" + user.password;

})
