const tabs = document.querySelectorAll(".tab");
const contents = document.querySelectorAll(".content");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove 'active' class
    tabs.forEach((t) => t.classList.remove("active"));
    contents.forEach((c) => c.classList.remove("active"));

    // Add 'active' to clicked tab
    tab.classList.add("active");
    const target = tab.dataset.tab;
    const content = document.getElementById(target);
    if (content) content.classList.add("active");

    // Reset all input fields in all forms
    document.querySelectorAll(".content form").forEach((form) => {
      form.reset();
    });

    // Also clear manually set input types like datetime-local or date
    document
      .querySelectorAll(
        ".content input[type='date'], .content input[type='datetime-local']"
      )
      .forEach((input) => {
        input.type = "text"; // reset to text so it doesn't show empty calendar
      });
  });
});

// -------------------- Edit Functionality --------------------

// Personnel
document.addEventListener("DOMContentLoaded", () => {
  const personnelTable = document.querySelector("#personnel .data-table tbody");

  personnelTable.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-icon")) {
      const row = e.target.closest("tr");
      const cells = row.querySelectorAll("td");

      document.querySelector("#personnel .id-input").value =
        cells[0].textContent.trim();
      document.querySelector("#personnel .name-input").value =
        cells[1].textContent.trim();
      document.querySelector("#personnel .rank-select").value =
        cells[2].textContent.trim();
      document.querySelector("#personnel .unit-input").value =
        cells[3].textContent.trim();

      // Switch tab
      switchToTab("personnel");
    }
  });
});

// Units
document.addEventListener("DOMContentLoaded", () => {
  const unitsTable = document.querySelector("#units .data-table tbody");

  unitsTable.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-icon")) {
      const row = e.target.closest("tr");
      const cells = row.querySelectorAll("td");

      document.querySelector(".unit-id-input").value =
        cells[0].textContent.trim();
      document.querySelector(".unit-name-input").value =
        cells[1].textContent.trim();
      document.querySelector(".unit-country-input").value =
        cells[2].textContent.trim();
      document.querySelector(".unit-type-input").value =
        cells[3].textContent.trim();
      document.querySelector(".unit-officer-id-input").value =
        cells[4].textContent.trim();
      document.querySelector(".unit-deployment-input").value =
        cells[5].textContent.trim();
      document.querySelector(".unit-operation-id-input").value =
        cells[6].textContent.trim();

      switchToTab("units");
    }
  });
});

// Operations
document.addEventListener("DOMContentLoaded", () => {
  const operationTable = document.querySelector("#operation .data-table tbody");
  const operationForm = document.querySelector("#operation form");

  const [
    opIdInput,
    opNameInput,
    startDateInput,
    endDateInput,
    statusSelect,
    objectiveInput,
    coalitionIdInput,
  ] = operationForm.querySelectorAll("input, select");

  operationTable.addEventListener("click", function (e) {
    if (e.target.classList.contains("edit-icon")) {
      const row = e.target.closest("tr");
      const cells = row.querySelectorAll("td");

      opIdInput.value = cells[0].textContent.trim();
      opNameInput.value = cells[1].textContent.trim();
      startDateInput.type = "date";
      endDateInput.type = "date";
      startDateInput.value = cells[2].textContent.trim().split("T")[0];
      endDateInput.value = cells[3].textContent.trim().split("T")[0];

      objectiveInput.value = cells[4].textContent.trim();
      statusSelect.value = cells[5].textContent.trim();
      coalitionIdInput.value = cells[6].textContent.trim();

      switchToTab("operation");
    }
  });
});

// Missions
document.addEventListener("DOMContentLoaded", () => {
  const missionTable = document.querySelector("#missions .data-table tbody");
  const missionForm = document.querySelector("#missions form");

  const [
    missionIdInput,
    missionNameInput,
    startTimeInput,
    endTimeInput,
    operationIdInput,
    assignedUnitIdInput,
  ] = missionForm.querySelectorAll("input");

  missionTable.addEventListener("click", function (e) {
    if (e.target.classList.contains("edit-icon")) {
      const row = e.target.closest("tr");
      const cells = row.querySelectorAll("td");

      missionIdInput.value = cells[0].textContent.trim();
      missionNameInput.value = cells[1].textContent.trim();

      startTimeInput.type = "datetime-local";
      endTimeInput.type = "datetime-local";
      startTimeInput.value = cells[2].textContent.trim();
      endTimeInput.value = cells[3].textContent.trim();
      operationIdInput.value = cells[4].textContent.trim();
      assignedUnitIdInput.value = cells[5].textContent.trim();

      switchToTab("missions");
    }
  });
});

// Equipment
document.addEventListener("DOMContentLoaded", function () {
  const equipmentTable = document.querySelector("#equipment .data-table tbody");
  const equipmentForm = document.querySelector("#equipment form");

  const [
    equipmentIdInput,
    nameInput,
    typeSelect,
    unitIdInput,
    serialInput,
    statusSelect,
    acquiredDateInput,
  ] = equipmentForm.querySelectorAll("input, select");

  equipmentTable.addEventListener("click", function (e) {
    if (e.target.classList.contains("edit-icon")) {
      const row = e.target.closest("tr");
      const cells = row.querySelectorAll("td");

      equipmentIdInput.value = cells[0].textContent.trim();
      nameInput.value = cells[1].textContent.trim();
      typeSelect.value = cells[2].textContent.trim();
      unitIdInput.value = cells[3].textContent.trim();
      serialInput.value = cells[4].textContent.trim();
      statusSelect.value = cells[5].textContent.trim();
      acquiredDateInput.type = "date";
      acquiredDateInput.value = cells[6].textContent.trim();

      switchToTab("equipment");
    }
  });
});

function switchToTab(tabName) {
  document
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelectorAll(".content")
    .forEach((content) => content.classList.remove("active"));
  document.querySelector(`[data-tab="${tabName}"]`).classList.add("active");
  document.getElementById(tabName).classList.add("active");
}

// -------------------- Fetch Data Functions --------------------

document.addEventListener("DOMContentLoaded", () => {
  fetchPersonnel();
  fetchUnits();
  fetchOperations();
  fetchMissions();
  fetchEquipment();
});

function fetchPersonnel() {
  fetch("http://localhost:5000/api/personnel")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#personnel .data-table tbody");
      tbody.innerHTML = "";
      data.forEach((person) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${person.P_ID || ""}</td>
          <td>${person.Name || ""}</td>
          <td>${person.Rank || ""}</td>
          <td>${person.UnitID || ""}</td>
          <td class="edit-cell"><i class="fas fa-pen edit-icon"></i></td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Error fetching personnel:", err);
    });
}

function fetchUnits() {
  fetch("http://localhost:5000/api/units")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#units .data-table tbody");
      tbody.innerHTML = "";
      data.forEach((unit) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${unit.UnitID || ""}</td>
          <td>${unit.UnitName || ""}</td>
          <td>${unit.Country || ""}</td>
          <td>${unit.Type || ""}</td>
          <td>${unit.OfficerID || ""}</td>
          <td>${unit.Deployment || ""}</td>
          <td>${unit.OP_ID || ""}</td>
          <td class="edit-cell"><i class="fas fa-pen edit-icon"></i></td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Error fetching units:", err);
    });
}

function fetchOperations() {
  fetch("http://localhost:5000/api/operations")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#operation .data-table tbody");
      tbody.innerHTML = "";
      data.forEach((op) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${op.OP_ID || ""}</td>
          <td>${op.OP_Name || ""}</td>
          <td>${op.StartDate.split("T")[0] || ""}</td>
          <td>${op.EndDate.trim().split("T")[0] || ""}</td>
          <td>${op.Objective || ""}</td>
          <td>${op.Status || ""}</td>
          <td>${op.CoalitionID || ""}</td>
          <td class="edit-cell"><i class="fas fa-pen edit-icon"></i></td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Error fetching operations:", err);
    });
}

function fetchMissions() {
  fetch("http://localhost:5000/api/missions")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#missions .data-table tbody");
      tbody.innerHTML = "";
      data.forEach((mission) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${mission.MI_ID || ""}</td>
          <td>${mission.MissionName || ""}</td>
          <td>${mission.StartTime.replace("T", " ").split(".")[0] || ""}</td>
          <td>${mission.EndTime.replace("T", " ").split(".")[0] || ""}</td>
          <td>${mission.OP_ID || ""}</td>
          <td>${mission.AssignedUnitID || ""}</td>
          <td class="edit-cell"><i class="fas fa-pen edit-icon"></i></td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Error fetching missions:", err);
    });
}

function fetchEquipment() {
  fetch("http://localhost:5000/api/equipment")
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("#equipment .data-table tbody");
      tbody.innerHTML = "";
      data.forEach((equipment) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${equipment.EQ_ID || ""}</td>
          <td>${equipment.Name || ""}</td>
          <td>${equipment.Type || ""}</td>
          <td>${equipment.UnitID || ""}</td>
          <td>${equipment.SerialNumber || ""}</td>
          <td>${equipment.Status || ""}</td>
          <td>${equipment.AcquiredDate.split("T")[0] || ""}</td>
          <td class="edit-cell"><i class="fas fa-pen edit-icon"></i></td>
        `;
        tbody.appendChild(row);
      });
    })
    .catch((err) => {
      console.error("Error fetching equipment:", err);
    });
}

// Add your fetchOperations(), fetchMissions(), and fetchEquipment() similarly...

// -------------------- Search Table Dynamic Headers --------------------

const tableColumns = {
  Personnel: ["P. ID", "Name", "Rank", "Unit ID"],
  Units: [
    "U. ID",
    "U. Name",
    "Country",
    "Type",
    "Officer ID",
    "Deployment",
    "Op. ID",
  ],
  Operation: [
    "OP. ID",
    "OP. Name",
    "Start Date",
    "End Date",
    "Objective",
    "Status",
    "Coalition ID",
  ],
  Missions: [
    "M. ID",
    "M. Name",
    "Start Time",
    "End Time",
    "Operation ID",
    "As. Unit ID",
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  const selectTable = document.querySelector(".select-table");
  const searchField = document.querySelector(".search-field");
  const searchResultsTable = document.querySelector(".search-results-table");

  selectTable.addEventListener("change", () => {
    const selectedTable = selectTable.value;
    searchField.innerHTML =
      "<option disabled selected>Select Search Field</option>";
    searchResultsTable.querySelector("thead tr").innerHTML = "";
    searchResultsTable.querySelector("tbody").innerHTML = "";

    if (tableColumns[selectedTable]) {
      tableColumns[selectedTable].forEach((field) => {
        const option = document.createElement("option");
        option.value = field;
        option.textContent = field;
        searchField.appendChild(option);

        const th = document.createElement("th");
        th.textContent = field;
        searchResultsTable.querySelector("thead tr").appendChild(th);
      });
    }
  });
});

/////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.querySelector("#personnel .add-button");

  addButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const idInput = document.querySelector("#personnel .id-input");
    const nameInput = document.querySelector("#personnel .name-input");
    const rankSelect = document.querySelector("#personnel .rank-select");
    const unitInput = document.querySelector("#personnel .unit-input");

    const p_id = idInput.value.trim();
    const name = nameInput.value.trim();
    const rank = rankSelect.value.trim();
    const unit_id = unitInput.value.trim();

    if (!p_id || !name || !rank || !unit_id || rank === "Select Rank") {
      alert("Please fill in all fields correctly.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/personnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          P_ID: p_id,
          Name: name,
          Rank: rank,
          UnitID: unit_id, // ✅ This must be "UnitID" (uppercase U and ID)
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Error adding personnel: " + (errorData.error || res.statusText));
        return;
      }

      alert("Personnel added successfully.");
      idInput.value = "";
      nameInput.value = "";
      rankSelect.selectedIndex = 0;
      unitInput.value = "";

      fetchPersonnel(); // ✅ Update the table after adding
    } catch (error) {
      console.error("Error adding personnel:", error);
      alert("Failed to add personnel.");
    }
  });

  fetchPersonnel(); // ✅ Load table when page loads
});

document.addEventListener("DOMContentLoaded", () => {
  const idInput = document.querySelector("#personnel .id-input");
  const nameInput = document.querySelector("#personnel .name-input");
  const rankSelect = document.querySelector("#personnel .rank-select");
  const unitInput = document.querySelector("#personnel .unit-input");

  const updateButton = document.querySelector("#personnel .update-button");
  const deleteButton = document.querySelector("#personnel .delete-button");

  // UPDATE personnel
  updateButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const p_id = idInput.value.trim();
    const name = nameInput.value.trim();
    const rank = rankSelect.value.trim();
    const unit_id = unitInput.value.trim();

    if (!p_id || !name || !rank || !unit_id || rank === "Select Rank") {
      alert("Please fill in all fields correctly.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/personnel/${p_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: name,
          Rank: rank,
          UnitID: unit_id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(
          "Error updating personnel: " + (errorData.error || res.statusText)
        );
        return;
      }

      alert("Personnel updated successfully.");
      idInput.value = "";
      nameInput.value = "";
      rankSelect.selectedIndex = 0;
      unitInput.value = "";

      fetchPersonnel(); // Update table after update
    } catch (error) {
      console.error("Error updating personnel:", error);
      alert("Failed to update personnel.");
    }
  });

  // DELETE personnel
  deleteButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const p_id = idInput.value.trim();

    if (!p_id) {
      alert("Please enter Personnel ID to delete.");
      return;
    }

    if (
      !confirm(`Are you sure you want to delete personnel with ID ${p_id}?`)
    ) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/personnel/${p_id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(
          "Error deleting personnel: " + (errorData.error || res.statusText)
        );
        return;
      }

      alert("Personnel deleted successfully.");
      idInput.value = "";
      nameInput.value = "";
      rankSelect.selectedIndex = 0;
      unitInput.value = "";

      fetchPersonnel(); // Update table after delete
    } catch (error) {
      console.error("Error deleting personnel:", error);
      alert("Failed to delete personnel.");
    }
  });

  fetchPersonnel(); // Load table on page load
});

/////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  // Inputs
  const unitIdInput = document.querySelector("#units .unit-id-input");
  const unitNameInput = document.querySelector("#units .unit-name-input");
  const unitCountryInput = document.querySelector("#units .unit-country-input");
  const unitTypeSelect = document.querySelector("#units .unit-type-input");
  const unitOfficerIdInput = document.querySelector(
    "#units .unit-officer-id-input"
  );
  const unitDeploymentInput = document.querySelector(
    "#units .unit-deployment-input"
  );
  const unitOperationIdInput = document.querySelector(
    "#units .unit-operation-id-input"
  );

  // Buttons
  const addButton = document.querySelector("#units .add-button");
  const updateButton = document.querySelector("#units .update-button");
  const deleteButton = document.querySelector("#units .delete-button");

  // ADD unit
  addButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const unit_id = unitIdInput.value.trim();
    const unit_name = unitNameInput.value.trim();
    const country = unitCountryInput.value.trim();
    const type = unitTypeSelect.value.trim();
    const officer_id = unitOfficerIdInput.value.trim();
    const deployment = unitDeploymentInput.value.trim();
    const operation_id = unitOperationIdInput.value.trim(); // ✅ Include OP_ID

    if (!unit_id || !unit_name || !country || !type || type === "Type") {
      alert("Please fill in all required fields correctly.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/units", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UnitID: unit_id,
          UnitName: unit_name,
          Country: country,
          Type: type,
          OfficerID: officer_id,
          Deployment: deployment,
          OperationID: operation_id, // ✅ Send OP_ID
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Error adding unit: " + (errorData.error || res.statusText));
        return;
      }

      alert("Unit added successfully.");
      clearUnitInputs();
      fetchUnits(); // refresh table
    } catch (error) {
      console.error("Error adding unit:", error);
      alert("Failed to add unit.");
    }
  });

  // UPDATE unit
  updateButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const unit_id = unitIdInput.value.trim();
    const unit_name = unitNameInput.value.trim();
    const country = unitCountryInput.value.trim();
    const type = unitTypeSelect.value.trim();
    const officer_id = unitOfficerIdInput.value.trim();
    const deployment = unitDeploymentInput.value.trim();
    const operation_id = unitOperationIdInput.value.trim(); // ✅ Include OP_ID

    if (!unit_id || !unit_name || !country || !type || type === "Type") {
      alert("Please fill in all required fields correctly.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/units/${unit_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          UnitName: unit_name,
          Country: country,
          Type: type,
          OfficerID: officer_id,
          Deployment: deployment,
          OperationID: operation_id, // ✅ Send OP_ID for update
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Error updating unit: " + (errorData.error || res.statusText));
        return;
      }

      alert("Unit updated successfully.");
      clearUnitInputs();
      fetchUnits(); // refresh table
    } catch (error) {
      console.error("Error updating unit:", error);
      alert("Failed to update unit.");
    }
  });

  // DELETE unit
  deleteButton.addEventListener("click", async (e) => {
    e.preventDefault();

    const unit_id = unitIdInput.value.trim();

    if (!unit_id) {
      alert("Please enter Unit ID to delete.");
      return;
    }

    if (!confirm(`Are you sure you want to delete unit with ID ${unit_id}?`)) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/units/${unit_id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Error deleting unit: " + (errorData.error || res.statusText));
        return;
      }

      alert("Unit deleted successfully.");
      clearUnitInputs();
      fetchUnits(); // refresh table
    } catch (error) {
      console.error("Error deleting unit:", error);
      alert("Failed to delete unit.");
    }
  });

  // Clear inputs
  function clearUnitInputs() {
    unitIdInput.value = "";
    unitNameInput.value = "";
    unitCountryInput.value = "";
    unitTypeSelect.selectedIndex = 0;
    unitOfficerIdInput.value = "";
    unitDeploymentInput.value = "";
    unitOperationIdInput.value = ""; // ✅ clear OP_ID input too
  }

  // Initial load
  fetchUnits(); // ⬅️ You'll need this function too!
});

///////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  // Inputs
  const opIdInput = document.querySelector(
    "#operation .id-input:nth-of-type(1)"
  );
  const opNameInput = document.getElementById("op-name-id");

  const startDateInput = document.querySelector(
    "#operation .date-input.id-input"
  );
  const endDateInput = document.querySelector(
    "#operation .date-input.rank-select"
  );
  const statusSelect = document.querySelector("#operation select");
  const objectiveInput = document.querySelector(
    "#operation input[placeholder='Objective']"
  );
  const coalitionIdInput = document.querySelector(
    "#operation input[placeholder='Coalition ID']"
  );

  // Buttons
  const addButton = document.querySelector("#operation .add-button");
  const updateButton = document.querySelector("#operation .update-button");
  const deleteButton = document.querySelector("#operation .delete-button");

  // Fetch and display operations
  async function fetchOperations() {
    try {
      const res = await fetch("http://localhost:5000/api/operations");
      const data = await res.json();

      const tbody = document.querySelector("#operation .data-table tbody");
      tbody.innerHTML = "";

      data.forEach((op) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${op.OP_ID || ""}</td>
          <td>${op.OP_Name || ""}</td>
          <td>${op.StartDate?.split("T")[0] || ""}</td>
          <td>${op.EndDate?.split("T")[0] || ""}</td>
          <td>${op.Objective || ""}</td>
          <td>${op.Status || ""}</td>
          <td>${op.CoalitionID || ""}</td>
          <td class="edit-cell"><i class="fas fa-pen edit-icon" style="cursor: pointer;"></i></td>
        `;
        // Add click listener for edit
        row.querySelector(".edit-icon").addEventListener("click", () => {
          opIdInput.value = op.OP_ID || "";
          opNameInput.value = op.OP_Name || "";
          startDateInput.value = op.StartDate?.split("T")[0] || "";
          endDateInput.value = op.EndDate?.split("T")[0] || "";
          objectiveInput.value = op.Objective || "";
          statusSelect.value = op.Status || "Status";
          coalitionIdInput.value = op.CoalitionID || "";
        });

        tbody.appendChild(row);
      });
    } catch (err) {
      console.error("Error fetching operations:", err);
    }
  }

  // Add Operation
  addButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const opID = opIdInput.value.trim();
    const opName = opNameInput.value.trim();
    const startDate = startDateInput.value.trim();
    const endDate = endDateInput.value.trim();
    const status = statusSelect.value;
    const objective = objectiveInput.value.trim();
    const coalitionID = coalitionIdInput.value.trim();

    if (!opID || !opName || !startDate || !endDate || status === "Status") {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/operations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          OP_ID: opID,
          OP_Name: opName,
          StartDate: startDate,
          EndDate: endDate,
          Objective: objective,
          Status: status,
          CoalitionID: coalitionID,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Error adding operation: " + (errorData.error || res.statusText));
        return;
      }

      alert("Operation added successfully.");
      clearOperationInputs();
      fetchOperations();
    } catch (err) {
      console.error("Error adding operation:", err);
      alert("Failed to add operation.");
    }
  });

  // Update Operation
  updateButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const opID = opIdInput.value.trim();
    const opName = opNameInput.value.trim();
    const startDate = startDateInput.value.trim();
    const endDate = endDateInput.value.trim();
    const status = statusSelect.value;
    const objective = objectiveInput.value.trim();
    const coalitionID = coalitionIdInput.value.trim();

    if (!opID || !opName || !startDate || !endDate || status === "Status") {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/operations/${opID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          OP_Name: opName,
          StartDate: startDate,
          EndDate: endDate,
          Objective: objective,
          Status: status,
          CoalitionID: coalitionID,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(
          "Error updating operation: " + (errorData.error || res.statusText)
        );
        return;
      }

      alert("Operation updated successfully.");
      clearOperationInputs();
      fetchOperations();
    } catch (err) {
      console.error("Error updating operation:", err);
      alert("Failed to update operation.");
    }
  });

  // Delete Operation
  deleteButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const opID = opIdInput.value.trim();

    if (!opID) {
      alert("Please enter Operation ID to delete.");
      return;
    }

    if (!confirm(`Are you sure you want to delete operation with ID ${opID}?`))
      return;

    try {
      const res = await fetch(`http://localhost:5000/api/operations/${opID}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(
          "Error deleting operation: " + (errorData.error || res.statusText)
        );
        return;
      }

      alert("Operation deleted successfully.");
      clearOperationInputs();
      fetchOperations();
    } catch (err) {
      console.error("Error deleting operation:", err);
      alert("Failed to delete operation.");
    }
  });

  // Clear input fields
  function clearOperationInputs() {
    opIdInput.value = "";
    opNameInput.value = "";
    startDateInput.value = "";
    endDateInput.value = "";
    objectiveInput.value = "";
    statusSelect.selectedIndex = 0;
    coalitionIdInput.value = "";
  }

  // Initial load
  fetchOperations();
});

//////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  const missionIdInput = document.getElementById("mission-id");
  const missionNameInput = document.getElementById("mission-name");
  const startTimeInput = document.getElementById("mission-start");
  const endTimeInput = document.getElementById("mission-end");
  const operationIdInput = document.getElementById("operation-id");
  const assignedUnitIdInput = document.getElementById("unit-id");

  const addButton = document.querySelector("#missions .add-button");
  const updateButton = document.querySelector("#missions .update-button");
  const deleteButton = document.querySelector("#missions .delete-button");
  const tbody = document.querySelector("#missions-table tbody");

  // Fetch all missions
  async function fetchMissions() {
    try {
      const res = await fetch("http://localhost:5000/api/missions");
      const data = await res.json();
      tbody.innerHTML = "";

      data.forEach((mission) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${mission.MI_ID}</td>
          <td>${mission.MissionName}</td>
          <td>${mission.StartTime.replace("T", " ").split(".")[0]}</td>
          <td>${mission.EndTime.replace("T", " ").split(".")[0]}</td>
          <td>${mission.OP_ID}</td>
          <td>${mission.AssignedUnitID}</td>
          <td class="edit-cell"><i class="fas fa-pen edit-icon" style="cursor:pointer;"></i></td>
        `;

        row.querySelector(".edit-icon").addEventListener("click", () => {
          missionIdInput.value = mission.MI_ID;
          missionNameInput.value = mission.MissionName;
          startTimeInput.value = mission.StartTime.split(".")[0].replace(
            " ",
            "T"
          );
          endTimeInput.value = mission.EndTime.split(".")[0].replace(" ", "T");
          operationIdInput.value = mission.OP_ID;
          assignedUnitIdInput.value = mission.AssignedUnitID;
        });

        tbody.appendChild(row);
      });
    } catch (err) {
      console.error("Error fetching missions:", err);
    }
  }

  // Add mission
  addButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const missionID = missionIdInput.value.trim();
    const missionName = missionNameInput.value.trim();
    const startTime = startTimeInput.value.trim().replace("T", " ") + ":00";
    const endTime = endTimeInput.value.trim().replace("T", " ") + ":00";
    const operationID = operationIdInput.value.trim();
    const assignedUnitID = assignedUnitIdInput.value.trim();

    if (
      !missionID ||
      !missionName ||
      !startTime ||
      !endTime ||
      !operationID ||
      !assignedUnitID
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/missions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          MI_ID: missionID,
          MissionName: missionName,
          StartTime: startTime,
          EndTime: endTime,
          OP_ID: operationID,
          AssignedUnitID: assignedUnitID,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert("Error adding mission: " + (errorData.error || res.statusText));
        return;
      }

      alert("Mission added successfully.");
      clearMissionInputs();
      fetchMissions();
    } catch (err) {
      console.error("Error adding mission:", err);
      alert("Failed to add mission.");
    }
  });

  // Update mission
  updateButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const missionID = missionIdInput.value.trim();
    const missionName = missionNameInput.value.trim();
    const startTime = startTimeInput.value.trim().replace("T", " ") + ":00";
    const endTime = endTimeInput.value.trim().replace("T", " ") + ":00";
    const operationID = operationIdInput.value.trim();
    const assignedUnitID = assignedUnitIdInput.value.trim();

    if (
      !missionID ||
      !missionName ||
      !startTime ||
      !endTime ||
      !operationID ||
      !assignedUnitID
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/missions/${missionID}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            MissionName: missionName,
            StartTime: startTime,
            EndTime: endTime,
            OP_ID: operationID,
            AssignedUnitID: assignedUnitID,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        alert("Error updating mission: " + (errorData.error || res.statusText));
        return;
      }

      alert("Mission updated successfully.");
      clearMissionInputs();
      fetchMissions();
    } catch (err) {
      console.error("Error updating mission:", err);
      alert("Failed to update mission.");
    }
  });

  // Delete mission
  deleteButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const missionID = missionIdInput.value.trim();

    if (!missionID) {
      alert("Please enter Mission ID to delete.");
      return;
    }

    if (
      !confirm(`Are you sure you want to delete mission with ID ${missionID}?`)
    )
      return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/missions/${missionID}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        alert("Error deleting mission: " + (errorData.error || res.statusText));
        return;
      }

      alert("Mission deleted successfully.");
      clearMissionInputs();
      fetchMissions();
    } catch (err) {
      console.error("Error deleting mission:", err);
      alert("Failed to delete mission.");
    }
  });

  // Clear input fields
  function clearMissionInputs() {
    missionIdInput.value = "";
    missionNameInput.value = "";
    startTimeInput.value = "";
    endTimeInput.value = "";
    operationIdInput.value = "";
    assignedUnitIdInput.value = "";
  }

  // Initial load
  fetchMissions();
});

////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  // Equipment input fields
  const equipmentInputs = document.querySelectorAll(
    ".equipment-form input, .equipment-form select"
  );
  const [
    equipmentIdInput,
    equipmentNameInput,
    equipmentTypeInput,
    unitIdInput,
    serialNumberInput,
    statusInput,
    acquiredDateInput,
  ] = equipmentInputs;

  // Equipment buttons
  const addEquipmentBtn = document.querySelector("#equipment .add-button");
  const updateEquipmentBtn = document.querySelector(
    "#equipment .update-button"
  );
  const deleteEquipmentBtn = document.querySelector(
    "#equipment .delete-button"
  );

  const equipmentTbody = document.querySelector("#equipment table tbody");

  // Fetch all equipment
  async function fetchEquipment() {
    try {
      const res = await fetch("http://localhost:5000/api/equipment");
      const data = await res.json();
      equipmentTbody.innerHTML = "";

      data.forEach((equipment) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${equipment.EQ_ID}</td>
          <td>${equipment.Name}</td>
          <td>${equipment.Type}</td>
          <td>${equipment.UnitID}</td>
          <td>${equipment.SerialNumber}</td>
          <td>${equipment.Status}</td>
          <td>${equipment.AcquiredDate.split("T")[0]}</td>
          <td class="edit-cell"><i class="fas fa-pen edit-icon" style="cursor:pointer;"></i></td>
        `;

        // Populate form on edit click
        row.querySelector(".edit-icon").addEventListener("click", () => {
          equipmentIdInput.value = equipment.EQ_ID;
          equipmentNameInput.value = equipment.Name;
          equipmentTypeInput.value = equipment.Type;
          unitIdInput.value = equipment.UnitID;
          serialNumberInput.value = equipment.SerialNumber;
          statusInput.value = equipment.Status;
          acquiredDateInput.type = "date";
          acquiredDateInput.value = equipment.AcquiredDate.split("T")[0];
        });

        equipmentTbody.appendChild(row);
      });
    } catch (err) {
      console.error("Error fetching equipment:", err);
    }
  }

  // Clear input fields
  function clearEquipmentInputs() {
    equipmentInputs.forEach((input) => {
      if (input.tagName === "SELECT") {
        input.selectedIndex = 0;
      } else {
        input.value = "";
        if (input.classList.contains("date-input")) input.type = "text";
      }
    });
  }

  // Add equipment
  addEquipmentBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const newEquipment = {
      EQ_ID: equipmentIdInput.value.trim(),
      Name: equipmentNameInput.value.trim(),
      Type: equipmentTypeInput.value,
      UnitID: unitIdInput.value.trim(),
      SerialNumber: serialNumberInput.value.trim(),
      Status: statusInput.value,
      AcquiredDate: acquiredDateInput.value.trim() + "T00:00:00", // Append time for SQL format
    };

    if (
      Object.values(newEquipment).some(
        (val) => !val || val === "Type" || val === "Status"
      )
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEquipment),
      });

      if (!res.ok) {
        const error = await res.json();
        alert("Error adding equipment: " + (error.error || res.statusText));
        return;
      }

      alert("Equipment added successfully.");
      clearEquipmentInputs();
      fetchEquipment();
    } catch (err) {
      console.error("Error adding equipment:", err);
      alert("Failed to add equipment.");
    }
  });

  // Update equipment
  updateEquipmentBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const eqId = equipmentIdInput.value.trim();
    if (!eqId) {
      alert("Please enter Equipment ID to update.");
      return;
    }

    const updatedEquipment = {
      Name: equipmentNameInput.value.trim(),
      Type: equipmentTypeInput.value,
      UnitID: unitIdInput.value.trim(),
      SerialNumber: serialNumberInput.value.trim(),
      Status: statusInput.value,
      AcquiredDate: acquiredDateInput.value.trim() + "T00:00:00",
    };

    if (
      Object.values(updatedEquipment).some(
        (val) => !val || val === "Type" || val === "Status"
      )
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/equipment/${eqId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEquipment),
      });

      if (!res.ok) {
        const error = await res.json();
        alert("Error updating equipment: " + (error.error || res.statusText));
        return;
      }

      alert("Equipment updated successfully.");
      clearEquipmentInputs();
      fetchEquipment();
    } catch (err) {
      console.error("Error updating equipment:", err);
      alert("Failed to update equipment.");
    }
  });

  // Delete equipment
  deleteEquipmentBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const eqId = equipmentIdInput.value.trim();
    if (!eqId) {
      alert("Please enter Equipment ID to delete.");
      return;
    }

    if (!confirm(`Are you sure you want to delete equipment with ID ${eqId}?`))
      return;

    try {
      const res = await fetch(`http://localhost:5000/api/equipment/${eqId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        alert("Error deleting equipment: " + (error.error || res.statusText));
        return;
      }

      alert("Equipment deleted successfully.");
      clearEquipmentInputs();
      fetchEquipment();
    } catch (err) {
      console.error("Error deleting equipment:", err);
      alert("Failed to delete equipment.");
    }
  });

  // Load equipment on page load
  fetchEquipment();
});

//////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
  const tableSelect = document.querySelector(".select-table");
  const fieldSelect = document.querySelector(".search-field");
  const searchForm = document.querySelector(".search-form");
  const keywordInput = document.querySelector(".keyword-input");
  const resultsTableHead = document.querySelector(
    ".search-results-table thead tr"
  );
  const resultsTableBody = document.querySelector(
    ".search-results-table tbody"
  );
  const reportContainer = document.querySelector(".section-report");

  // Field options per table
  const tableFields = {
    Personnel: ["P_ID", "Name", "Rank", "UnitID"],
    Units: [
      "UnitID",
      "UnitName",
      "Country",
      "Type",
      "OfficerID",
      "Deployment",
      "OP_ID",
    ],
    Operations: [
      "OP_ID",
      "OP_Name",
      "StartDate",
      "EndDate",
      "Objective",
      "Status",
      "CoalitionID",
    ],
    Missions: [
      "MI_ID",
      "MissionName",
      "StartTime",
      "EndTime",
      "OP_ID",
      "AssignedUnitID",
    ],
    Equipment: [
      "EQ_ID",
      "Name",
      "Type",
      "UnitID",
      "SerialNumber",
      "Status",
      "AcquiredDate",
    ],
  };

  // Numeric fields (same as backend)
  const numericFields = [
    "P_ID",
    "UnitID",
    "OfficerID",
    "OP_ID",
    "MI_ID",
    "EQ_ID",
    "AssignedUnitID",
  ];

  // Populate search fields when table changes
  tableSelect.addEventListener("change", () => {
    const selectedTable = tableSelect.value;
    fieldSelect.innerHTML =
      "<option disabled selected>Select Search Field</option>";

    if (tableFields[selectedTable]) {
      tableFields[selectedTable].forEach((field) => {
        const option = document.createElement("option");
        option.value = field;
        option.textContent = field;
        fieldSelect.appendChild(option);
      });
    }
  });

  // Handle search form submission
  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const table = tableSelect.value;
    const field = fieldSelect.value;
    const keyword = keywordInput.value.trim();

    if (!table || !field || !keyword) {
      alert("Please select a table, a field, and enter a keyword.");
      return;
    }

    // Validate keyword for numeric fields
    if (numericFields.includes(field)) {
      if (isNaN(Number(keyword))) {
        alert(`Please enter a valid number for the field "${field}".`);
        return;
      }
    }

    try {
      const url = `http://localhost:5000/api/search?table=${encodeURIComponent(
        table
      )}&field=${encodeURIComponent(field)}&keyword=${encodeURIComponent(
        keyword
      )}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error(data.message || "Unexpected server response.");
      }

      // Clear previous results
      resultsTableHead.innerHTML = "";
      resultsTableBody.innerHTML = "";

      if (data.length === 0) {
        resultsTableBody.innerHTML =
          "<tr><td colspan='100%'>No records found.</td></tr>";
        updateReport(0);
        return;
      }

      // Create headers
      const headers = Object.keys(data[0]);
      headers.forEach((header) => {
        const th = document.createElement("th");
        th.textContent = header;
        resultsTableHead.appendChild(th);
      });

      // Populate rows
      data.forEach((row) => {
        const tr = document.createElement("tr");
        headers.forEach((header) => {
          const td = document.createElement("td");
          let value = row[header] !== null ? row[header].toString() : "";

          // Highlight keyword in selected field
          if (header === field && keyword !== "") {
            const regex = new RegExp(`(${keyword})`, "gi");
            value = value.replace(regex, '<span class="highlight">$1</span>');
            td.innerHTML = value;
          } else {
            td.textContent = value;
          }

          tr.appendChild(td);
        });
        resultsTableBody.appendChild(tr);
      });

      updateReport(data.length);
    } catch (err) {
      console.error("Search error:", err);
      alert("An error occurred while searching. Please try again.");
    }
  });

  function updateReport(count) {
    // Clear existing content
    reportContainer.innerHTML = "";

    const label = document.createElement("span");
    label.className = "report-text";
    label.innerHTML = "<b>Report:</b> Total Records Found";

    const countSpan = document.createElement("span");
    countSpan.className = "report-count";
    countSpan.textContent = count.toString();

    reportContainer.appendChild(label);
    reportContainer.appendChild(countSpan);
  }
});
