// API URLS needed to consume data
// Team data

const apiURL =
  //   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/PL/teams";
  "https://api.football-data.org/v4/competitions/PL/team";

// Postcode data for getting long/lat
const locationApiURL = "https://api.postcodes.io/postcodes/";

// Get user geolocation and store longitude and latitde

let userLat;
let userLong;
let hasLocation = false;
let hasFootballData = false;
let apiData;
let postcode;
let locData;
let clubLat;
let clubLong;
let dist;
let distanceArray = [];
let postCodeArray = [];

export const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0,
};

export function success(pos) {
  const crd = pos.coords;
  userLat = crd.latitude;
  userLong = crd.longitude;
  hasLocation = true;
}

export function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

// export { userLat, userLong, hasLocation };

// Get team data from football api and then set the available teams for dropdown and grab long/lat from the postcodes of the teams

export const getData = async () => {
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

// export { apiData, hasFootballData };

// function that returns only the postcode from each clubs address, and then returns the postcode data associated with each club using GetPostcodeData()

export const getClubPostCode = () => {
  for (const property of apiData.teams) {
    const address = property.address;
    const arr = address.split(" ");
    postcode = arr.slice(Math.max(arr.length - 2, 1));
    postcode = postcode.toString();
    postcode = postcode.replace(",", "");
    getClubLongLat(postcode);
  }
};

// Get long/lat for each club from location api using club postcode

const getClubLongLat = async (clubPostcode) => {
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

// function that creates a dropdown list in the html for all the teams in the api

export const setAvailableTeams = () => {
  for (const property of apiData.teams) {
    const option = document.createElement("option");
    option.value = property.name;
    option.text = property.name;
    footballTeam.add(option);
  }
};

// function that removed elements inserted into the DOM (to refresh data)

export function removeElement(id) {
  var elem = document.getElementById(id);
  return elem.parentNode.removeChild(elem);
}

export {
  apiData,
  hasFootballData,
  userLat,
  userLong,
  hasLocation,
  distanceArray,
  postCodeArray,
};
