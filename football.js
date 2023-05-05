const apiURL =
  //   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/teams/57";
  "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/PL/teams";
//   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/teams/57/matches";
//   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/PL/standings";
//   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/persons/99813/matches";

let apiData;

async function getData() {
  const { data } = await axios.get(apiURL, {
    headers: {
      "X-Auth-Token": "578ac68774834c4a82e28093ac0183a6",
      Origin: "X-Requested-With",
    },
  });
  console.log(data);
  apiData = data;

  setAvailableTeams();
}

getData();

const setAvailableTeams = () => {
  for (const property in apiData.teams.name) {
    const option = document.createElement("option");
    option.value = property;
    option.text = property;
    footballTeam.add(option);
  }
};

const dropdownList = document.getElementById("footballTeam");
const selectedTeam = dropdownList.value;
console.log(selectedTeam);

dropdownList.onchange = (e) => {
  const selectedTeam = dropdownList.value;
  console.log(selectedTeam);
  console.log(apiData);

  const filteredData = apiData.teams.find((team) =>
    team.name.includes(selectedTeam)
  );
  console.log(filteredData);
};
