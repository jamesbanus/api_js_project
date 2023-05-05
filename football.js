const apiURL =
  //   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/teams/57";
  "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/PL/teams";
//   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/teams/57/matches";
//   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/PL/standings";
//   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/persons/99813/matches";

let apiData;

async function football() {
  const { data } = await axios.get(apiURL, {
    headers: {
      "X-Auth-Token": "578ac68774834c4a82e28093ac0183a6",
      Origin: "X-Requested-With",
    },
  });
  console.log(data);
  apiData = data;
  return data;
}

football();

const dropdownList = document.getElementById("football-team");
const selectedTeam = dropdownList.value;
console.log(selectedTeam);

dropdownList.onchange = (e) => {
  const selectedTeam = dropdownList.value;
  console.log(selectedTeam);
  console.log(apiData);
  // const filterTest = apiData.list.map((item) => {
  //   return item.teams[0].name;
  // });
  // console.log(filterTest);

  const filteredData = apiData.teams.find((team) =>
    team.name.includes(selectedTeam)
  );
  console.log(filteredData);
};
