const projectTeamMembersDOM = document.querySelector(".project__sidebar-members");
const projectTitleDOM = document.querySelector(".project__main-title");
const projectManagerDOM = document.querySelector(".project__owner-name");
const projectRisksDOM = document.querySelector(".project__project-risks");
const projectFunctionReqsDOM = document.querySelector(".project__project-functional-reqs");
const projectNonFunctionReqsDOM = document.querySelector(".project__project-non-functional-reqs");
const userDOM = document.querySelector(".project__user");

const API_BASE_ROUTE = "/api/v1";

const username = localStorage.getItem("username") || "";
let dashboardId = "";

userDOM.textContent = username;

const fetchProjectRisks = (data) => {
  projectManagerDOM.innerHTML = "";
  for (const item of data.dashboards[0].projectRisks) {
    const projectRiskListElement = document.createElement("li");
    projectRiskListElement.classList.add("project__section-card");
    projectRiskListElement.innerHTML = [
      `<div class="flex justify-between items-center">`,
      `<span class="project__section-card-status | text-sm text-red-600"
                                    data-status="high">${item.status}</span>`,
      `<div class="flex items-center gap-4">
                                    <i class="cursor-pointer fa-solid fa-pen-to-square"></i>
                                    <i class="cursor-pointer fa-solid fa-x"></i>
                                </div>`,
      `</div>`,
      ` <p class="project__section-card-title | text-lg font-medium">${item.title}</p>`,
      `<p class="project__section-card-text">${item.description}</p>`,
      `</li>`,
    ].join("");
    projectRisksDOM.append(projectRiskListElement);
  }
};

const fetchFunctionalReqs = (data) => {
  projectFunctionReqsDOM.innerHTML = "";
  for (const item of data.dashboards[0].functionalRequirements) {
    const projectFunctionReqsListElement = document.createElement("li");
    projectFunctionReqsListElement.classList.add("project__section-card");
    projectFunctionReqsListElement.innerHTML = [
      `<div class="flex justify-between items-center">`,
      `<p class="project__section-card-title | text-lg font-medium">${item.title}</p>`,
      `<div class="flex items-center gap-4">
                                    <i class="cursor-pointer fa-solid fa-pen-to-square"></i>
                                    <i class="cursor-pointer fa-solid fa-x"></i>
                                </div>`,
      `</div>`,
      `<p class="project__section-card-text">${item.description}</p>`,
      `</li>`,
    ].join("");
    projectFunctionReqsDOM.append(projectFunctionReqsListElement);
  }
};

const fetchNonFunctionalReqs = (data) => {
  projectNonFunctionReqsDOM.innerHTML = "";
  for (const item of data.dashboards[0].nonFunctionalRequirements) {
    const nonFunctionalReqsListElement = document.createElement("li");
    nonFunctionalReqsListElement.classList.add("project__section-card");
    nonFunctionalReqsListElement.innerHTML = [
      `<div class="flex justify-between items-center">`,
      `<p class="project__section-card-title | text-lg font-medium">${item.title}</p>`,
      `<div class="flex items-center gap-4">
                                    <i class="cursor-pointer fa-solid fa-pen-to-square"></i>
                                    <i class="cursor-pointer fa-solid fa-x"></i>
                                </div>`,
      `</div>`,
      `<p class="project__section-card-text">${item.description}</p>`,
      `</li>`,
    ].join("");
    projectNonFunctionReqsDOM.append(nonFunctionalReqsListElement);
  }
};

const fetchTeamMembers = (data) => {
  projectTeamMembersDOM.innerHTML = "";
  for (const item of data.dashboards[0].teamMembers) {
    const teamMembersListElement = document.createElement("li");
    teamMembersListElement.classList.add("project__sidebar-members-item");
    teamMembersListElement.innerHTML = [
      `<input class="b-0 bg-transparent w-1/2 outline-0" type="text" value="${item.name}" disabled>`,
      `<div class="flex items-center gap-4">
                                    <i class="cursor-pointer fa-solid fa-pen-to-square"></i>
                                    <i class="cursor-pointer fa-solid fa-x"></i>
                                </div>`,
      `</li>`,
    ].join("");
    projectTeamMembersDOM.append(teamMembersListElement);
  }
};

// GET request to "/" to fetch the user's dashboard data
const fetchDashboardData = async () => {
  const token = localStorage.getItem("token");

  try {
    const { data } = await axios.get(`${API_BASE_ROUTE}/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dashboardId = data.dashboards[0]._id;

    projectTitleDOM.value = data.dashboards[0].title;
    fetchProjectRisks(data);
    fetchFunctionalReqs(data);
    fetchNonFunctionalReqs(data);
    fetchTeamMembers(data);
  } catch (error) {
    console.log(error.response);
  }
};

await fetchDashboardData();

// Event Listeners

// Update Title - CRUD
projectTitleDOM.addEventListener("change", async () => {
  const token = localStorage.getItem("token");

  try {
    await axios.patch(
      `${API_BASE_ROUTE}/dashboard/${dashboardId}/title`,
      {
        title: projectTitleDOM.value,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await fetchDashboardData();
  } catch (error) {
    console.log(error.response);
  }
});