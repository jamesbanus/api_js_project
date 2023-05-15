// Global variables

let filteredData;
let selectedTeam;
let gk;
let def;
let mid;
let fwd;
let colour1;
let colour2;
let displayText;
let closestClubName;

// Get user geolocation and store longitude and latitde

import {
  options,
  success,
  error,
  hasLocation,
  getData,
  apiData,
  hasFootballData,
  getClubPostCode,
  distanceArray,
  postCodeArray,
  setAvailableTeams,
  removeElement,
} from "./utils.js";

navigator.geolocation.getCurrentPosition(success, error, options);

// Get team data from football api and then set the available teams for dropdown and grab long/lat from the postcodes of the teams

getData();

// check we have football data before running setAvailableTeams()

const checkHasFootballInterval = setInterval(() => {
  if (hasFootballData === true) {
    setAvailableTeams();
    clearInterval(checkHasFootballInterval);
  }
}, 100);

//  check we have location data before running getClubPostCode()

const checkHasLocInterval = setInterval(() => {
  if (hasLocation === true) {
    getClubPostCode();
    clearInterval(checkHasLocInterval);
  }
}, 100);

// Display a different message depending on the status of the geolocation and whether the name of the club has been returned

const checkHasLocalClub = setInterval(() => {
  if (hasLocation === false) {
    displayText = "Please allow location services to see this feature";
  } else if (closestClubName === undefined && hasLocation === true) {
    displayText = "Loading";
  } else {
    displayText =
      "Based on your location, your nearest club is " + closestClubName;
    clearInterval(checkHasLocalClub);
  }
  document.getElementById("userClubText").textContent = displayText;
}, 100);

//  Check the array of distances between user and clubs is 20 (the amount of clubs there are). If so:
// 1. return shortest distance
// 2. Find the index of that distance
// 3. Find the corresponding postcode by searching the postCode Array for that index
// 4. Take the last 3 characters of the postcode (uniform for all teams)
// 5. search the api data for the club with the last 3 characters of that post code
// 6. Return the club name and clear interval

const checkArrInterval = setInterval(() => {
  if (distanceArray.length === 20) {
    const shortestDist = Math.min(...distanceArray);
    const indexOfDist = distanceArray.indexOf(shortestDist);
    const closestClubPostCode = postCodeArray[indexOfDist];
    const last3 = closestClubPostCode.slice(-3);
    const closestClubInfo = apiData.teams.find((postcode) =>
      postcode.address.includes(last3)
    );
    closestClubName = closestClubInfo.name;
    clearInterval(checkArrInterval);
  }
}, 100);

// // function that filters the data to find only the team the user selects from the dropdown

const filterTeam = () => {
  filteredData = apiData.teams.find((team) => team.name.includes(selectedTeam));
};

// // function that filters the selected team by position

const getSquad = () => {
  gk = filteredData.squad.filter((gks) => gks.position.includes("Goalkeeper"));
  def = filteredData.squad.filter((defs) => defs.position.includes("Defence"));
  mid = filteredData.squad.filter((mids) => mids.position.includes("Midfield"));
  fwd = filteredData.squad.filter((fwds) => fwds.position.includes("Offence"));
};

// // function that extracts the colour combination for each club and stores them separately

const getClubColours = () => {
  const colourCombo = filteredData.clubColors;
  const colours = colourCombo.split(" / ");
  colour1 = colours[0];
  colour2 = colours[1];
  colour1 = colour1.replace(/\s+/g, "");
  colour2 = colour2.replace(/\s+/g, "");
};

// // function that removed elements inserted into the DOM (to refresh data)

// function removeElement(id) {
//   var elem = document.getElementById(id);
//   return elem.parentNode.removeChild(elem);
// }

// function that builds the squad.
// 1. Create empty div and make it a child of the relevant positional div
// 2. For each item in the filtered position data, create a new div with the name of the player with a 'p' tag and append to previous empty div (so we can use grid)
// 3. Change the border top colour to one of the club colours, choose the secondary colour if the first one is white

const squadbuilder = (pos, id, parent) => {
  const newDiv = document.createElement("div");
  document.getElementById(parent).appendChild(newDiv);
  newDiv.setAttribute("id", id);
  for (const property of pos) {
    const newInnerDiv = document.createElement("div");
    const node = document.createElement("p");
    const textnode = document.createTextNode(property.name);
    node.appendChild(textnode);
    document.getElementById(id).appendChild(newInnerDiv);
    newInnerDiv.appendChild(node);
    if (colour1 === "White") {
      newInnerDiv.style.borderTopColor = colour2;
    } else {
      newInnerDiv.style.borderTopColor = colour1;
    }
  }
};

// Get initial value from dropdown list (should be 'select')

let dropdownList = document.getElementById("footballTeam");
selectedTeam = dropdownList.value;
console.log(selectedTeam);

// On change of dropdown list:
// 1. If a user has selected a team already (dropdown list does not equal 'select'), call the removeElement function so we don't have 2 teams data showing. Otherwise skip
// 2. Filter for the team the user has selected with setTeam()
// 3. Filter for the squad with setSquad()
// 4. Extract the 2 team colours with setColour()
// 5. Set the page header with the name of the team + 'Squad'
// 6. Set the header and border to team colours, avoiding white as the border
// 7. Set headers of each section to relevant positions
// 8. Using squadbuilder(), display the squad in their relevant sections by position

dropdownList.onchange = (e) => {
  if (selectedTeam != "select") {
    removeElement("GoalkeepersInner");
    removeElement("DefendersInner");
    removeElement("MidfieldersInner");
    removeElement("ForwardsInner");
  }

  selectedTeam = dropdownList.value;

  filterTeam();

  getSquad();

  getClubColours();

  document.getElementById("header").innerHTML = selectedTeam + " Squad";

  if (colour1 === "White") {
    document.getElementById("header").style.color = colour2;
    document.getElementById("header").style.backgroundColor = colour1;
  } else {
    document.getElementById("header").style.color = colour1;
    document.getElementById("header").style.backgroundColor = colour2;
  }

  document.getElementById("gkHeader").textContent = "Goalkeepers";
  document.getElementById("defHeader").textContent = "Defenders";
  document.getElementById("midHeader").textContent = "Midfielders";
  document.getElementById("fwdHeader").textContent = "Forwards";

  squadbuilder(gk, "GoalkeepersInner", "Goalkeepers");
  squadbuilder(def, "DefendersInner", "Defenders");
  squadbuilder(mid, "MidfieldersInner", "Midfielders");
  squadbuilder(fwd, "ForwardsInner", "Forwards");
};
