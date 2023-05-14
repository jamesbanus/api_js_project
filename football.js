const apiURL =
  //   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/teams/57";
  "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/PL/teams";
//   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/teams/57/matches";
//   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/competitions/PL/standings";
//   "https://cors-anywhere.herokuapp.com/https://api.football-data.org/v4/persons/99813/matches";

let apiData;
let filteredData;
let selectedTeam;
let teamData;
let gk;
let def;
let mid;
let fwd;

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

getData();

const setAvailableTeams = () => {
  for (const property of apiData.teams) {
    const option = document.createElement("option");
    option.value = property.name;
    option.text = property.name;
    footballTeam.add(option);
  }
};

const setTeam = () => {
  filteredData = apiData.teams.find((team) => team.name.includes(selectedTeam));
};

const setSquad = () => {
  gk = filteredData.squad.filter((gks) => gks.position.includes("Goalkeeper"));
  def = filteredData.squad.filter((defs) => defs.position.includes("Defence"));
  mid = filteredData.squad.filter((mids) => mids.position.includes("Midfield"));
  fwd = filteredData.squad.filter((fwds) => fwds.position.includes("Offence"));
};

function removeElement(id) {
  var elem = document.getElementById(id);
  return elem.parentNode.removeChild(elem);
}

const squadbuilder = (pos, id, parent) => {
  const newDiv = document.createElement("div");
  document.getElementById(parent).appendChild(newDiv);
  newDiv.setAttribute("id", id);
  for (const property of pos) {
    const node = document.createElement("div");
    const textnode = document.createTextNode(property.name);
    node.appendChild(textnode);
    document.getElementById(id).appendChild(node);
  }
};

const dropdownList = document.getElementById("footballTeam");
selectedTeam = dropdownList.value;
console.log(selectedTeam);

dropdownList.onchange = (e) => {
  if (selectedTeam != "select") {
    removeElement("GoalkeepersInner");
    removeElement("DefendersInner");
    removeElement("MidfieldersInner");
    removeElement("ForwardsInner");
  }

  selectedTeam = dropdownList.value;
  console.log(selectedTeam);

  setTeam();
  console.log(filteredData);

  setSquad();
  console.log(gk);

  const colourCombo = filteredData.clubColors;
  const colours = colourCombo.split(" / ");
  let colour1 = colours[0];
  let colour2 = colours[1];
  colour1 = colour1.replace(/\s+/g, "");
  colour2 = colour2.replace(/\s+/g, "");
  document.getElementById("header").innerHTML = selectedTeam + " Squad";
  document.getElementById("header").style.color = colour1;
  document.getElementById("header").style.backgroundColor = colour2;

  document.getElementById("gkHeader").textContent = "Goalkeepers";
  document.getElementById("defHeader").textContent = "Defenders";
  document.getElementById("midHeader").textContent = "Midfielders";
  document.getElementById("fwdHeader").textContent = "Forwards";

  // const newDiv = document.createElement("div");
  // document.getElementById("Goalkeepers").appendChild(newDiv);
  // newDiv.setAttribute("id", "GoalkeepersInner");

  // for (const property of gk) {
  //   const node = document.createElement("div");
  //   const textnode = document.createTextNode(property.name);
  //   node.appendChild(textnode);
  //   document.getElementById("GoalkeepersInner").appendChild(node);
  // }
  squadbuilder(gk, "GoalkeepersInner", "Goalkeepers");
  squadbuilder(def, "DefendersInner", "Defenders");
  squadbuilder(mid, "MidfieldersInner", "Midfielders");
  squadbuilder(fwd, "ForwardsInner", "Forwards");
};
