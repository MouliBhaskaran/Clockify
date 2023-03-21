Date.prototype.addHours = function (num) {
  let diff = num * 60 * 60 * 1000;
  this.setTime(this.getTime() + diff);
  return this;
};
Date.prototype.addMinutes = function (num) {
  let diff = num * 60 * 1000;
  this.setTime(this.getTime() + diff);
  return this;
};
Date.prototype.addSeconds = function (num) {
  let diff = num * 1000;
  this.setTime(this.getTime() + diff);
  return this;
};

const wrapNegativeMod = (n, m) => {
  return ((n % m) + m) % m;
};

const zeroPadforTens = (val) => {
  return Number(val) > 9 ? `${Number(val)}` : `0${Number(val)}`;
};

const addDelimitedTimePeriodStrings = (t1, t2) => {
  let t_s = new Array(3);
  let t1_s = t1.split(":");
  let t2_s = t2.split(":");

  t_s[2] = Number(t1_s[2]) + Number(t2_s[2]);
  t_s[1] = Number(t1_s[1]) + Number(t2_s[1]) + Math.floor(t_s[2] / 60);
  t_s[0] = Number(t1_s[0]) + Number(t2_s[0]) + Math.floor(t_s[1] / 60);

  t_s[2] %= 60;
  t_s[1] %= 60;

  t_s[0] = zeroPadforTens(t_s[0]);
  t_s[1] = zeroPadforTens(t_s[1]);
  t_s[2] = zeroPadforTens(t_s[2]);

  return t_s.join(":");
};

const subtractDelimitedTimePeriodStrings = (t1, t2) => {
  let t_s = new Array(3);
  const t1_s = t1.split(":");
  const t2_s = t2.split(":");

  t_s[2] = wrapNegativeMod(Number(t1_s[2]) - Number(t2_s[2]), 60);
  t_s[1] = wrapNegativeMod(
    Number(t1_s[1]) - Number(t2_s[1]) + (t1_s[2] >= t2_s[2] ? 0 : -1),
    60
  );
  t_s[0] = wrapNegativeMod(
    Number(t1_s[0]) - Number(t2_s[0]) + (t1_s[1] >= t2_s[1] ? 0 : -1),
    24
  );

  t_s[0] = zeroPadforTens(t_s[0]);
  t_s[1] = zeroPadforTens(t_s[1]);
  t_s[2] = zeroPadforTens(t_s[2]);

  return t_s.join(":");
};

const clearProjectsDisplay = () => {
  let projects = document.getElementsByClassName("projects")[0];
  let root = document.getElementById("root");

  if (projects) {
    root.removeChild(projects);
  }
};

const validateYYYYMMDDDateString = (dateString) => {
  const [year, month, date] = dateString.split("/");
  if (
    !year ||
    Number(year) < 0 ||
    !month ||
    Number(month) < 1 ||
    Number(month) > 12 ||
    !date ||
    Number(date) < 1 ||
    Number(date) > 31
  ) {
    return { status: false };
  }
  return {
    status: true,
    year: zeroPadforTens(year),
    month: zeroPadforTens(month),
    date: zeroPadforTens(date),
  };
};

const validateHHMMSSTimeString = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":");
  if (
    !hours ||
    Number(hours) < 0 ||
    Number(hours) > 23 ||
    !minutes ||
    Number(minutes) < 0 ||
    Number(minutes) > 59 ||
    !seconds ||
    Number(seconds) < 0 ||
    Number(seconds) > 59
  ) {
    return { status: false };
  }
  return {
    status: true,
    hours: zeroPadforTens(hours),
    minutes: zeroPadforTens(minutes),
    seconds: zeroPadforTens(seconds),
  };
};

function updateDisplay() {
  clearProjectsDisplay();

  cleanProjects();

  let projects = JSON.parse(localStorage.getItem("projects") || "[]");

  let projectsDiv = document.createElement("div");
  projectsDiv.className = "projects";

  let root = document.getElementById("root");
  root.appendChild(projectsDiv);

  for (let i = 0; i < projects.length; ++i) {
    const project = projects[i];
    let projectDiv = document.createElement("div");
    projectDiv.className = "project";

    let projectHeaderDiv = document.createElement("div");
    projectHeaderDiv.className = "project__header";

    let projectNameH3 = document.createElement("h3");
    projectNameH3.className = "project__name";
    projectNameH3.innerHTML = `Project name: ${project.name}`;

    let project_time = "00:00:00";

    let projectRecordsUl = document.createElement("ul");
    projectRecordsUl.className = "project__records";

    for (let j = 0; j < project.records.length; ++j) {
      const record = project.records[j];
      for (let k = 0; k < record.times.length; ++k) {
        const time = record.times[k];
        let start_time_obj = new Date(time.start_time);
        let times = time.time_period.split(":");
        let end_time_obj = new Date(start_time_obj);
        end_time_obj = end_time_obj
          .addHours(Number(times[0]))
          .addMinutes(Number(times[1]))
          .addSeconds(Number(times[2]));

        let projectRecordLi = document.createElement("li");
        projectRecordLi.classList.add("project__record");
        projectRecordLi.id = `${projectRecordLi.className}-${i}_${j}_${k}`;
        if (j != 0 && k == 0) {
          projectRecordLi.classList.add("project__record--divider");
        }

        let recordDescInput = document.createElement("input");
        recordDescInput.type = "text";
        recordDescInput.placeholder = "Add a description";
        recordDescInput.value = record.desc;
        recordDescInput.data = recordDescInput.value;
        recordDescInput.className = "record__desc";
        recordDescInput.addEventListener("change", change_desc_action);

        let recordStartDateInput = document.createElement("input");
        recordStartDateInput.type = "text";
        recordStartDateInput.placeholder = "Start date (YYYY/MM/DD)";
        recordStartDateInput.value =
          zeroPadforTens(start_time_obj.getFullYear()) +
          "/" +
          zeroPadforTens(start_time_obj.getMonth() + 1) +
          "/" +
          zeroPadforTens(start_time_obj.getDate());
        recordStartDateInput.data = recordStartDateInput.value;
        recordStartDateInput.className = "record__startDate";
        recordStartDateInput.addEventListener(
          "change",
          change_startDate_action
        );

        let recordStartTimeInput = document.createElement("input");
        recordStartTimeInput.type = "text";
        recordStartTimeInput.placeholder = "Start time (HH:MM:SS)";
        recordStartTimeInput.value =
          zeroPadforTens(start_time_obj.getHours()) +
          ":" +
          zeroPadforTens(start_time_obj.getMinutes()) +
          ":" +
          zeroPadforTens(start_time_obj.getSeconds());
        recordStartTimeInput.data = recordStartTimeInput.value;
        recordStartTimeInput.className = "record__startTime";
        recordStartTimeInput.addEventListener(
          "change",
          change_startTime_action
        );

        let recordTimeDash = document.createElement("p");
        recordTimeDash.innerHTML = "-";

        let recordEndTimeInput = document.createElement("input");
        recordEndTimeInput.type = "text";
        recordEndTimeInput.placeholder = "End time (HH:MM:SS)";
        recordEndTimeInput.value =
          zeroPadforTens(end_time_obj.getHours()) +
          ":" +
          zeroPadforTens(end_time_obj.getMinutes()) +
          ":" +
          zeroPadforTens(end_time_obj.getSeconds());
        recordEndTimeInput.data = recordEndTimeInput.value;
        recordEndTimeInput.className = "record__endTime";
        recordEndTimeInput.addEventListener("change", change_endTime_action);

        let recordTimeInput = document.createElement("input");
        recordTimeInput.type = "text";
        recordTimeInput.placeholder = "Duration (HH:MM:SS)";
        recordTimeInput.value = time.time_period;
        recordTimeInput.data = recordTimeInput.value;
        recordTimeInput.className = "record__time";
        recordTimeInput.addEventListener("change", change_timePeriod_action);

        let recordDeleteImg = document.createElement("img");
        recordDeleteImg.src = "assets/close.png";
        recordDeleteImg.alt = "Discard timer";
        recordDeleteImg.className =
          "entryDetails__timediscard entryDetails__timediscard--disp";
        recordDeleteImg.addEventListener("click", click_delete_action);

        projectRecordLi.appendChild(recordDescInput);
        projectRecordLi.appendChild(recordStartDateInput);
        projectRecordLi.appendChild(recordStartTimeInput);
        projectRecordLi.appendChild(recordTimeDash);
        projectRecordLi.appendChild(recordEndTimeInput);
        projectRecordLi.appendChild(recordTimeInput);
        projectRecordLi.appendChild(recordDeleteImg);

        projectRecordsUl.appendChild(projectRecordLi);

        project_time = addDelimitedTimePeriodStrings(
          project_time,
          time.time_period
        );
      }
    }

    let projectTimeH3 = document.createElement("h3");
    projectTimeH3.className = "project__time";
    projectTimeH3.innerHTML = `Total time: ${project_time}`;

    projectHeaderDiv.appendChild(projectNameH3);
    projectHeaderDiv.appendChild(projectTimeH3);

    projectDiv.appendChild(projectHeaderDiv);
    projectDiv.appendChild(projectRecordsUl);

    projectsDiv.appendChild(projectDiv);
  }
}

function change_desc_action() {
  if (this.value != "") {
    this.data = this.value;

    let [proj, rec, time] = this.parentNode.id.slice(16).split("_");

    let projects = JSON.parse(localStorage.getItem("projects") || "[]");

    projects[proj].records[rec].desc = this.value;

    localStorage.setItem("projects", JSON.stringify(projects));

    updateDisplay();
  } else {
    this.value = this.data;
  }
}

function change_startDate_action() {
  const validationResult = validateYYYYMMDDDateString(this.value);
  if (validationResult.status) {
    this.data = this.value;

    let [proj, rec, time] = this.parentNode.id.slice(16).split("_");

    let projects = JSON.parse(localStorage.getItem("projects") || "[]");

    let start_time_obj = new Date(
      projects[proj].records[rec].times[time].start_time
    );

    start_time_obj.setDate(Number(validationResult.date));
    start_time_obj.setMonth(Number(validationResult.month - 1));
    start_time_obj.setFullYear(Number(validationResult.year));

    projects[proj].records[rec].times[time].start_time =
      start_time_obj.toISOString();

    localStorage.setItem("projects", JSON.stringify(projects));
  } else {
    this.value = this.data;
  }

  updateDisplay();
}

function change_startTime_action() {
  const validationResult = validateHHMMSSTimeString(this.value);
  if (validationResult.status) {
    this.data = this.value;
    let [proj, rec, time] = this.parentNode.id.slice(16).split("_");

    let projects = JSON.parse(localStorage.getItem("projects") || "[]");

    let start_time_obj = new Date(
      projects[proj].records[rec].times[time].start_time
    );

    start_time_obj.setHours(validationResult.hours);
    start_time_obj.setMinutes(validationResult.minutes);
    start_time_obj.setSeconds(validationResult.seconds);

    let end_time_elem = document.querySelector(
      `#${this.parentNode.id} > .record__endTime`
    );

    let updated_time_period = subtractDelimitedTimePeriodStrings(
      end_time_elem.value,
      this.value
    );

    projects[proj].records[rec].times[time].start_time =
      start_time_obj.toISOString();

    projects[proj].records[rec].times[time].time_period = updated_time_period;

    localStorage.setItem("projects", JSON.stringify(projects));
  } else {
    this.value = this.data;
  }

  updateDisplay();
}

function change_endTime_action() {
  const validationResult = validateHHMMSSTimeString(this.value);
  if (validationResult.status) {
    this.data = this.value;

    let [proj, rec, time] = this.parentNode.id.slice(16).split("_");

    let projects = JSON.parse(localStorage.getItem("projects") || "[]");

    let start_time_elem = document.querySelector(
      `#${this.parentNode.id} > .record__startTime`
    );

    let updated_time_period = subtractDelimitedTimePeriodStrings(
      this.value,
      start_time_elem.value
    );

    projects[proj].records[rec].times[time].time_period = updated_time_period;

    localStorage.setItem("projects", JSON.stringify(projects));
  } else {
    this.value = this.data;
  }

  updateDisplay();
}

function change_timePeriod_action() {
  const validationResult = validateHHMMSSTimeString(this.value);
  if (validationResult.status) {
    this.data = this.value;

    let [proj, rec, time] = this.parentNode.id.slice(16).split("_");

    let projects = JSON.parse(localStorage.getItem("projects") || "[]");

    projects[proj].records[rec].times[
      time
    ].time_period = `${validationResult.hours}:${validationResult.minutes}:${validationResult.seconds}`;

    localStorage.setItem("projects", JSON.stringify(projects));
  } else {
    this.value = this.data;
  }

  updateDisplay();
}

function click_delete_action() {
  let projects = JSON.parse(localStorage.getItem("projects") || "[]");

  let [proj, rec, time] = this.parentNode.id.slice(16).split("_");

  projects[proj].records[rec].times.splice(time, 1);

  localStorage.setItem("projects", JSON.stringify(projects));

  updateDisplay();
}

function cleanProjects() {
  const projects = JSON.parse(localStorage.getItem("projects") || "[]");

  //iterate projects
  let project_flags = [];
  for (let i = 0; i < projects.length; ++i) {
    //iterate records
    let record_flags = [];
    for (let j = 0; j < projects[i].records.length; ++j) {
      if (projects[i].records[j].times.length === 0) {
        record_flags.push(j);
      }
    }
    for (let j = record_flags.length - 1; j >= 0; j--) {
      projects[i].records.splice(j, 1);
    }
    if (projects[i].records.length === 0) {
      project_flags.push(i);
    }
  }
  for (let i = project_flags.length - 1; i >= 0; i--) {
    projects.splice(i, 1);
  }

  localStorage.setItem("projects", JSON.stringify(projects));
}