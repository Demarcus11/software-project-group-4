import {
  fetchDashboardData,
  displayDashboardData,
  API_BASE_ROUTE,
  dashboardId,
} from "./dashboard.js";

const projectRisksDOM = document.querySelector(".project__project-risks");
const projectRiskEditBtns = document.querySelectorAll(".project-risk-edit-btn");
const projectRiskModalDOM = document.querySelector("#edit-project-risk-modal");
const projectRiskFormDOM = document.querySelector(".edit-modal__form");
const projectRiskIdDOM = document.querySelector("#project-risk-id");
const projectRiskTitleDOM = document.querySelector("#project-risk-name");
const projectRiskDescriptionDOM = document.querySelector("#project-risk-description");
const projectRiskStatusLowDOM = document.querySelector("#project-risk-status-low");
const projectRiskStatusModerateDOM = document.querySelector("#project-risk-status-moderate");
const projectRiskStatusHighDOM = document.querySelector("#project-risk-status-high");

let projectRiskId = "";

// CREATE

// READ
export function fetchProjectRisks(data) {
  projectRisksDOM.innerHTML = "";
  for (const item of data.dashboards[0].projectRisks) {
    const projectRiskListElement = document.createElement("li");
    projectRiskListElement.classList.add("project__section-card");
    projectRiskListElement.dataset.id = item._id;
    projectRiskListElement.innerHTML = [
      `<div class="flex justify-between items-center">`,
      `<span class="project__section-card-status | text-sm"
                                    data-status=${item.status.toLowerCase()}>${item.status}</span>`,
      `<div class="flex items-center gap-4">
                                    <i class="project-risk-edit-btn | cursor-pointer fa-solid fa-pen-to-square"></i>
                                    <i class="cursor-pointer fa-solid fa-x"></i>
                                </div>`,
      `</div>`,
      ` <p class="project__section-card-title | text-lg font-medium">${item.title}</p>`,
      `<p class="project__section-card-text">${item.description}</p>`,
      `</li>`,
    ].join("");
    projectRisksDOM.append(projectRiskListElement);
  }

  // grab edit buttons after they've been created, if you grab them at the top of the code they won't havent been created yet, thus getting 'null'
  const editRiskBtns = document.querySelectorAll(".project-risk-edit-btn");
  editRiskBtns.forEach((button) => {
    button.addEventListener("click", handleEditRiskClick);
  });
}

// UPDATE
async function handleEditRiskClick(e) {
  projectRiskModalDOM.showModal();

  const clickedElement = e.target;
  const projectRiskElement = clickedElement.closest(".project__section-card");

  if (projectRiskElement) {
    projectRiskId = projectRiskElement.dataset.id;

    try {
      const data = await fetchDashboardData();

      for (const risk of data.dashboards[0].projectRisks) {
        if (risk._id === projectRiskId) {
          let { _id: riskID, title, description, status } = risk;

          projectRiskIdDOM.textContent = `${riskID}`;
          projectRiskTitleDOM.value = title;
          projectRiskDescriptionDOM.value = description;

          switch (status) {
            case "Low":
              projectRiskStatusLowDOM.checked = true;
              break;
            case "Moderate":
              projectRiskStatusModerateDOM.checked = true;
              break;
            case "High":
              projectRiskStatusHighDOM.checked = true;
              break;
          }
        }
      }
    } catch (error) {
      console.log(error.response);
    }
  }
}

async function handleProjectRiskFormSubmit() {
  const token = localStorage.getItem("token");

  const newProjectRisk = {
    title: projectRiskTitleDOM.value,
    description: projectRiskDescriptionDOM.value,
  };

  if (projectRiskStatusLowDOM.checked) {
    newProjectRisk.status = "Low";
    document.querySelector(".project__section-card-status").dataset.status = "low";
  } else if (projectRiskStatusModerateDOM.checked) {
    newProjectRisk.status = "Moderate";
    document.querySelector(".project__section-card-status").dataset.status = "moderate";
  } else if (projectRiskStatusHighDOM.checked) {
    newProjectRisk.status = "High";
    document.querySelector(".project__section-card-status").dataset.status = "high";
  }

  try {
    await axios.patch(
      `${API_BASE_ROUTE}/dashboard/${dashboardId}/project-risks/${projectRiskId}`,
      newProjectRisk,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    await displayDashboardData();
  } catch (error) {
    console.log(error.response);
  }
}

projectRiskFormDOM.addEventListener("submit", handleProjectRiskFormSubmit);

// DELETE
