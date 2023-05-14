const apiURL =
  //   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/teams/57";
  "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/PL/teams";
//   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/teams/57/matches";
//   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/PL/standings";
//   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/persons/99813/matches";

let apiData;

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

    setAvailableTeams();
  } catch (e) {
    console.log(e);
  }
};

// async function getData() {
//   const { data } = await axios.get(apiURL, {
//     headers: {
//       "X-Auth-Token": "578ac68774834c4a82e28093ac0183a6",
//       Origin: "X-Requested-With",
//     },
//   });
//   console.log(data);
//   apiData = data;

//   setAvailableTeams();
// }

getData();

const setAvailableTeams = () => {
  for (const property of apiData.teams) {
    const option = document.createElement("option");
    option.value = property.name;
    option.text = property.name;
    footballTeam.add(option);
    console.log(property);
  }
};

const dropdownList = document.getElementById("footballTeam");
const selectedTeam = dropdownList.value;
console.log(selectedTeam);

dropdownList.onchange = (e) => {
  const selectedTeam = dropdownList.value;
  console.log(selectedTeam);

  const filteredData = apiData.teams.find((team) =>
    team.name.includes(selectedTeam)
  );
  console.log(filteredData);
  const colourCombo = filteredData.clubColors;
  console.log(colourCombo);
  const colours = colourCombo.split(" / ");
  let colour1 = colours[0];
  let colour2 = colours[1];
  colour1 = colour1.replace(/\s+/g, "");
  colour2 = colour2.replace(/\s+/g, "");
  console.log(colour1);
  console.log(colour2);
  document.getElementById("header").innerHTML = selectedTeam + " Squad";
  document.getElementById("header").style.color = colour1;
  document.getElementById("header").style.backgroundColor = colour2;
};
