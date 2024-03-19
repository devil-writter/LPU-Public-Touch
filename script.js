document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM loaded'); // Check if DOMContentLoaded event is fired
    
    const form = document.getElementById('searchForm');
    const regNumberInput = document.getElementById('reg_number');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const regNumber = regNumberInput.value.trim();

        if (regNumber === '') {
            alert('Please enter a registration number.');
            return;
        }

        fetchStudentData(regNumber);
    });

    function fetchStudentData(regNumber) {
        fetch('master.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n');
                let studentData = null;

                for (let row of rows) {
                    const columns = row.split(',');
                    if (columns[0].trim() === regNumber) {
                        studentData = columns;
                        break;
                    }
                }

                if (studentData) {
                    displayStudentData(studentData);
                    fetchPersonalData(regNumber);
                } else {
                    alert('Student not found.');
                }
            })
            .catch(error => console.error('Error fetching student data:', error));
    }

    function fetchPersonalData(regNumber) {
        fetch('personal.csv')
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n');
                let personalData = null;

                for (let row of rows) {
                    const columns = row.split(',');
                    if (columns[0].trim() === regNumber) {
                        personalData = columns;
                        break;
                    }
                }

                if (personalData) {
                    displayPersonalData(personalData);
                } else {
                    console.error('Personal data not found.');
                }
            })
            .catch(error => console.error('Error fetching personal data:', error));
    }

    function displayStudentData(studentData) {
        document.getElementById('regNo').textContent = studentData[0];
        document.getElementById('cgpa').textContent = studentData[3];
        document.getElementById('gender').textContent = studentData[4];
    
        // Fetch and display course data
        const regNumber = studentData[0].trim();
        fetchCourseData(regNumber);
    }

    function displayPersonalData(personalData) {
        document.getElementById('name').textContent = personalData[1];
        document.getElementById('mobile').textContent = personalData[2];
        document.getElementById('email').textContent = personalData[3];
    }
});
function fetchCourseData(regNumber) {
    fetch('master.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n');
            const courseData = rows
                .filter(row => row.trim().startsWith(regNumber))
                .map(row => row.split(','));

            displayCourseData(courseData);
        })
        .catch(error => console.error('Error fetching course data:', error));
}

function displayCourseData(courseData) {
    const courseTableBody = document.getElementById('courseTableBody');
    courseTableBody.innerHTML = ''; // Clear previous data

    courseData.forEach(row => {
        const [regNumber, grade, courseCode] = row;
        const rowElement = document.createElement('tr');
        rowElement.innerHTML = `<td>${courseCode}</td><td>${grade}</td>`;
        courseTableBody.appendChild(rowElement);
    });
}