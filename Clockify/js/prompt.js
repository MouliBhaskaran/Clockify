function closePromptBox() {
  let promptBox = document.getElementById("entryActions__promptBox");
  let promptClose = document.getElementById("entryActions__promptClose");
  let promptSelect = document.getElementById("entryActions__promptSelect");
  let projectSelBtn = document.getElementById(
    "entryActions__projectSelectButton"
  );

  if (window.new_proj == false) {
    if (promptSelect && promptSelect.value != "") {
      window.selected_project = promptSelect.value;
    }
  }
  projectSelBtn.innerHTML = window.selected_project ? window.selected_project : "Project";
  promptBox.parentNode.removeChild(promptBox);
  promptClose.parentNode.removeChild(promptClose);
}

function displayPromptBox(msg, data) {
  window.new_proj = false;
  let boxId = "entryActions__promptBox";
  let boxClass = "entryDetails__promptBox";
  let promptBox;

  let msgId = "entryActions__promptMsg";
  let msgClass = "entryDetails__promptMsg";
  let promptMsg;

  let selectId = "entryActions__promptSelect";
  let selectClass = "entryDetails__promptSelect";
  let promptSelect;
  let optionIdBase = "entryActions__promptOption";

  let closeId = "entryActions__promptClose";
  let closeClass = "entryDetails__promptClose";
  let promptClose;

  promptBox = document.createElement("div");
  promptBox.id = boxId;
  promptBox.className = boxClass;

  promptMsg = document.createElement("h2");
  promptMsg.id = msgId;
  promptMsg.className = msgClass;
  promptMsg.innerHTML = msg;

  promptBox.appendChild(promptMsg);

  promptSelect = document.createElement("select");
  promptSelect.id = selectId;
  promptSelect.className = selectClass;

  let promptOptionNew = document.createElement("button");
  promptOptionNew.id = "entryActions__newProject";
  promptOptionNew.className = "entryDetails__newProjectName";
  promptOptionNew.innerHTML = "Create New Project";
  promptOptionNew.addEventListener("click", click_newProj_action);

  if (data && data.length > 0) {
    data.forEach((project) => {
      let promptOption = document.createElement("option");
      promptOption.id = `${optionIdBase}_${project.name}`;
      promptOption.className = "entryDetails__projectName";
      promptOption.value = project.name;
      promptOption.innerHTML = project.name;
      promptSelect.appendChild(promptOption);
    });

    promptBox.appendChild(promptSelect);
  }
  promptBox.appendChild(promptOptionNew);

  document.body.appendChild(promptBox);

  promptClose = document.createElement("div");
  promptClose.id = closeId;
  promptClose.className = closeClass;
  promptClose.addEventListener("click", closePromptBox);
  document.body.appendChild(promptClose);
}

function click_newProj_action() {
  let nameId = "entryActions__newProjInput";
  let nameClass = "entryDetails__description";
  let namePlaceholder = "Enter project name";
  let newProjName;

  newProjName = document.createElement("input");
  newProjName.id = nameId;
  newProjName.className = nameClass;
  newProjName.placeholder = namePlaceholder;

  this.parentNode.insertBefore(newProjName, this);
  this.innerHTML = "Create";

  this.removeEventListener("click", click_newProj_action);
  this.addEventListener("click", click_create_action);
}

function click_create_action() {
  let data = JSON.parse(localStorage.getItem("projects"));
  let newProjName = document.getElementById("entryActions__newProjInput").value;
  if (newProjName != "") {
    if (data) {
      let projNames = [];
      let existingProj = false;

      projNames = data.map((project) => project.name);
      for (let i = 0; i < projNames.length; ++i) {
        if (projNames[i] === newProjName) {
          existingProj = true;
          break;
        }
      }

      if (existingProj) {
        window.alert("Project already exists!");
        return;
      } else {
        let newProj = {};
        newProj.name = newProjName;
        newProj.records = [];
        data.push(newProj);
        localStorage.setItem("projects", JSON.stringify(data));
      }
    } else {
      let projects = [];
      let newProj = {};
      newProj.name = newProjName;
      newProj.records = [];
      projects.push(newProj);
      localStorage.setItem("projects", JSON.stringify(projects));
    }

    window.new_proj = true;
    window.selected_project = newProjName;
    let promptClose = document.getElementById("entryActions__promptClose");
    promptClose.click();
  }
}