document.addEventListener("DOMContentLoaded", function () {
  let records = [];
  let students = [];

  Promise.all([
    fetch("data.json")
      .then((response) => response.json())
      .then((data) => (records = data)),
    fetch("students.json")
      .then((response) => response.json())
      .then((data) => (students = data)),
  ]).catch((error) => console.error("Failed to load data:", error));

  document.getElementById("searchBtn").addEventListener("click", function () {
    const regNumber = document.getElementById("searchRegNumber").value.trim();
    const student = students.find(
      (s) => s["Registration Number"] === regNumber
    );

    if (student) {
      document.getElementById("studentDetails").innerHTML = `
                    <h2>Student Details</h2>
                    <div>Name: ${student.Name}</div>
                    <div>Registration Number: ${student["Registration Number"]}</div>
                    <div>School Name: ${student.SchoolName}</div>
                    <div>Section: ${student.Section}</div>
                    <div>Email: ${student.Email}</div>
                    <div>Mobile: ${student.Mobile}</div>
                    <div>CGPA: ${student.Cgpa}</div>
                    <div>Gender: ${student.Gender}</div>
                    <button type="button" class="showDetailsBtn">Show Details</button>
                `;

      document.getElementById("studentDetails").classList.remove("hide");

      document
        .querySelector("#studentDetails .showDetailsBtn")
        .addEventListener("click", function () {
          const tablesContainer = document.getElementById("tablesContainer");
          tablesContainer.innerHTML = "";
          const terms = [
            ...new Set(
              records
                .filter((r) => r.RegisterationNumber === regNumber)
                .map((r) => r.TermId)
            ),
          ];
          terms.forEach((term) => {
            const termRecords = records.filter(
              (r) => r.RegisterationNumber === regNumber && r.TermId === term
            );
            const table = document.createElement("table");
            table.innerHTML = `<thead>
                            <th colspan="2" style="background-color: #007bff; color: white;text-align: center;">Term ID: ${term}</th>
                            <tr>
                                <th>Course Code</th>
                                <th>Grade</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${termRecords
                              .map(
                                (r) =>
                                  `<tr><td>${r.CourseCode}</td><td>${r.Grade}</td></tr>`
                              )
                              .join("")}
                        </tbody>`;
            tablesContainer.appendChild(table);
          });
        });
    } else {
      fetch("data.json")
        .then((response) => response.json())
        .then((data) => {
          const record = data.find((r) => r.RegisterationNumber === regNumber);
          if (record) {
            document.getElementById("result").innerHTML =
              `<h2>Student Details</h2>` +
              `<span class="record-item">Reg no:</span> <span class="record-value">${record.RegisterationNumber}</span><br>` +
              `<span class="record-item">School name:</span> <span class="record-value">${record.SchoolName}</span><br>` +
              `<span class="record-item">CGPA:</span> <span class="record-value">${record.Cgpa}</span><br>` +
              `<span class="record-item">Gender:</span> <span class="record-value">${
                record.Gender === "M" ? "Male" : "Female"
              }</span>`;

            document.getElementById(
              "result"
            ).innerHTML += `<button id="showDataDetailsBtn">Show Details</button>`;

            document
              .getElementById("showDataDetailsBtn")
              .addEventListener("click", function () {
                const tablesContainer =
                  document.getElementById("tablesContainer");
                tablesContainer.innerHTML = "";
                const terms = [
                  ...new Set(
                    data
                      .filter((r) => r.RegisterationNumber === regNumber)
                      .map((r) => r.TermId)
                  ),
                ];
                terms.forEach((term) => {
                  const termRecords = data.filter(
                    (r) =>
                      r.RegisterationNumber === regNumber && r.TermId === term
                  );
                  const table = document.createElement("table");
                  table.innerHTML = `<thead>
                                        <th colspan="2" style="background-color: #007bff; color: white;text-align: center;">Term ID: ${term}</th>
                                        <tr>
                                            <th>Course Code</th>
                                            <th>Grade</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${termRecords
                                          .map(
                                            (r) =>
                                              `<tr><td>${r.CourseCode}</td><td>${r.Grade}</td></tr>`
                                          )
                                          .join("")}
                                    </tbody>`;
                  tablesContainer.appendChild(table);
                });
              });
          } else {
            document.getElementById("result").innerHTML =
              "Student record not found in both files.";
            document.getElementById("tablesContainer").innerHTML = "";
          }
        });
    }
  });
});
document.getElementById("searchBtn").addEventListener("click", function () {
  document.getElementById("result").innerHTML = "";
  document.getElementById("studentDetails").innerHTML = "";
  document.getElementById("tablesContainer").innerHTML = "";
});
