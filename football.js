// API URLS needed to consume data
// Team data
const apiURL =
  //   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/teams/57";
  "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/PL/teams";
//   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/teams/57/matches";
//   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/PL/standings";
//   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/persons/99813/matches";

// Postcode data for getting long/lat
const locationApiURL = "https://api.postcodes.io/postcodes/";

// Global variables

let apiData;
let filteredData;
let selectedTeam;
let teamData;
let gk;
let def;
let mid;
let fwd;
let colour1;
let colour2;
let locData;
let distanceArray = [];
let postCodeArray = [];
let userLat;
let userLong;
let clubLat;
let clubLong;
let hasLocation = false;
let hasFootballData = false;
let dist;
let postcode;

// Get user geolocation and store longitude and latitde

const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

function success(pos) {
  const crd = pos.coords;

  console.log("Your current position is:");
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);
  userLat = crd.latitude;
  userLong = crd.longitude;
  hasLocation = true;
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

// Get team data from football api and then set the available teams for dropdown and grab long/lat from the postcodes of the teams

const getData = async () => {
  try {
    const { data } = await axios.get(apiURL, {
      headers: {
        "X-Auth-Token": "578ac68774834c4a82e28093ac0183a6",
        Origin: "X-Requested-With",
      },
    });
    console.log(data);
    apiData = data;
    hasFootballData = true;
  } catch (e) {
    console.log(e);
  }
};

getData();

const checkHasInterval = setInterval(() => {
  if (hasLocation === true && hasFootballData === true) {
    setAvailableTeams();
    getPostCode();
    clearInterval(checkHasInterval);
  }
}, 100);

// function that returns only the postcode from each clubs address, and then returns the postcode data associated with each club using GetPostcodeData()

const getPostCode = () => {
  for (const property of apiData.teams) {
    const address = property.address;
    const arr = address.split(" ");
    postcode = arr.slice(Math.max(arr.length - 2, 1));
    postcode = postcode.toString();
    postcode = postcode.replace(",", "");
    getPostcodeData(postcode);
  }
  console.log(distanceArray, postCodeArray);

  const checkArrinterval = setInterval(() => {
    if (distanceArray.length === 20) {
      const shortestDist = Math.min(...distanceArray);
      console.log(shortestDist);
      const indexOfDist = distanceArray.indexOf(shortestDist);
      console.log(indexOfDist);
      console.log(postCodeArray[indexOfDist]);
      clearInterval(checkArrinterval);
    }
  }, 100);
};

// Get long/lat for each club from location api using club postcode

const getPostcodeData = async (clubPostcode) => {
  try {
    const { data } = await axios.get(locationApiURL + clubPostcode, {});
    locData = data;
    clubLat = locData.result.latitude;
    clubLong = locData.result.longitude;
    dist = getDistanceFromLatLonInKm(userLat, userLong, clubLat, clubLong);
    distanceArray.push(dist);
    postCodeArray.push(clubPostcode);
  } catch (e) {
    console.log(e);
  }
};

// function that creates a dropdown list in the html for all the teams in the api

const setAvailableTeams = () => {
  for (const property of apiData.teams) {
    const option = document.createElement("option");
    option.value = property.name;
    option.text = property.name;
    footballTeam.add(option);
  }
};

// function that filters the data to find only the team the user selects from the dropdown

const setTeam = () => {
  filteredData = apiData.teams.find((team) => team.name.includes(selectedTeam));
};

// function that filters the selected team by position

const setSquad = () => {
  gk = filteredData.squad.filter((gks) => gks.position.includes("Goalkeeper"));
  def = filteredData.squad.filter((defs) => defs.position.includes("Defence"));
  mid = filteredData.squad.filter((mids) => mids.position.includes("Midfield"));
  fwd = filteredData.squad.filter((fwds) => fwds.position.includes("Offence"));
};

// function that extracts the colour combination for each club and stores them separately

const setColour = () => {
  const colourCombo = filteredData.clubColors;
  const colours = colourCombo.split(" / ");
  colour1 = colours[0];
  colour2 = colours[1];
  colour1 = colour1.replace(/\s+/g, "");
  colour2 = colour2.replace(/\s+/g, "");
};

// function that removed elements inserted into the DOM (to refresh data)

function removeElement(id) {
  var elem = document.getElementById(id);
  return elem.parentNode.removeChild(elem);
}

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

// function that calculates distance between 2 points using long/lat

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

// Get initial value from dropdown list (should be 'select')

const dropdownList = document.getElementById("footballTeam");
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

  setTeam();
  console.log(filteredData);

  setSquad();

  setColour();

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
