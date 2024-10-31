let editEmployeeId = null;
let currentPage = 1;
const rowsPerPage = 10;
let currentLanguage = 'en'; // Default language

// Translation dictionary
const translations = {
    en: {
        employeeList: "Employee List (Table View)",
        header: "ING",
        employees: "& Employees",
        addNew: "+ Add New",
        employeeListHeader: "Employee List",
        firstName: "First Name",
        lastName: "Last Name",
        dateOfEmployment: "Date of Employment",
        dateOfBirth: "Date of Birth",
        phone: "Phone",
        email: "Email",
        department: "Department",
        position: "Position",
        actions: "Actions",
        analytics: "Analytics",
        tech: "Tech",
        junior: "Junior",
        medior: "Medior",
        senior: "Senior",
        addEmployee: "Add Employee",
        editEmployee: "Edit Employee",
        dateOfEmployment: "Date of Employment",
        dateOfBirth: "Date of Birth",
        phone: "Phone",
        email: "Email",
        UpdateBtn: "Update",
    },
    tr: {
        employeeList: "Çalışan Listesi (Tablo Görünümü)",
        header: "İNG",
        employees: "& Çalışanlar",
        addNew: "+ Yeni Ekle",
        employeeListHeader: "Çalışan Listesi",
        firstName: "Ad",
        lastName: "Soyad",
        dateOfEmployment: "İşe Başlama Tarihi",
        dateOfBirth: "Doğum Tarihi",
        phone: "Telefon",
        email: "E-posta",
        department: "Departman",
        position: "Pozisyon",
        actions: "İşlemler",
        analytics: "Analitik",
        tech: "Teknoloji",
        junior: "Çaylak",
        medior: "Orta Düzey",
        senior: "Kıdemli",
        addEmployee: "Çalışan Ekle",
        editEmployee: "Çalışan Düzenle",
        dateOfEmployment: "İşe Başlama Tarihi",
        dateOfBirth: "Doğum Tarihi",
        phone: "Telefon",
        email: "E-posta",
        UpdateBtn: "Güncelle",

    }
};

// Helper function to format date to dd/MM/yyyy
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize employees in localStorage if not present
    if (!localStorage.getItem('employees')) {
        const employees = [];
        for (let i = 1; i <= 100; i++) {
            employees.push({
                id: i,
                firstName: 'Ahmet',
                lastName: 'Sourtimes',
                dateOfEmployment: '23/09/2022',
                dateOfBirth: '23/09/2022',
                phone: '+(90) 532 123 45 67',
                email: `ahmet${i}@sourtimes.org`,
                department: 'analytics',
                position: 'junior'
            });
        }
        localStorage.setItem('employees', JSON.stringify(employees));
    }

    displayEmployees();
    setupPagination();
});

// Function to display employees based on the current page and language
function displayEmployees() {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const tableBody = document.getElementById('employee-table-body');
    tableBody.innerHTML = '';

    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const employeesToDisplay = employees.slice(startIndex, endIndex);

    employeesToDisplay.forEach(employee => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', employee.id);

        // Translate department and position based on the current language
        const departmentTranslation = translations[currentLanguage][employee.department] || employee.department;
        const positionTranslation = translations[currentLanguage][employee.position] || employee.position;

        // Format the dates
        const formattedDateOfEmployment = (employee.dateOfEmployment);
        const formattedDateOfBirth = (employee.dateOfBirth);

        row.innerHTML = `
            <td><input type="checkbox"></td>
            <td class="boldText">${employee.firstName}</td>
            <td class="boldText">${employee.lastName}</td>
            <td>${formattedDateOfEmployment}</td>
            <td>${formattedDateOfBirth}</td>
            <td>${employee.phone}</td>
            <td>${employee.email}</td>
            <td>${departmentTranslation}</td>
            <td>${positionTranslation}</td>
            <td>
                <button class="edit-btn">✏️</button>
                <button class="delete-btn">🗑️</button>
            </td>
        `;
        tableBody.appendChild(row);

        row.querySelector('.edit-btn').addEventListener('click', () => openEditModal(employee));
        row.querySelector('.delete-btn').addEventListener('click', () => {
            openConfirmationModal(
                `Selected employee record of ${employee.firstName} ${employee.lastName} will be deleted.`,
                () => deleteEmployee(employee.id, row)
            );
        });
    });
}

// Function to set up pagination
function setupPagination() {
    const employees = JSON.parse(localStorage.getItem('employees')) || [];
    const totalPages = Math.ceil(employees.length / rowsPerPage);

    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    const prevButton = document.createElement('button');
    prevButton.innerHTML = '&#8249;';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            displayEmployees();
            setupPagination();
        }
    });
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.className = i === currentPage ? 'active' : '';
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayEmployees();
                setupPagination();
            });
            paginationContainer.appendChild(pageButton);
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginationContainer.appendChild(ellipsis);
        }
    }

    const nextButton = document.createElement('button');
    nextButton.innerHTML = '&#8250;';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayEmployees();
            setupPagination();
        }
    });
    paginationContainer.appendChild(nextButton);
}

// Function to delete an employee
function deleteEmployee(employeeId, row) {
    let employees = JSON.parse(localStorage.getItem('employees'));
    employees = employees.filter(employee => employee.id !== employeeId);
    localStorage.setItem('employees', JSON.stringify(employees));
    row.remove();
    displayEmployees();
    setupPagination();
}

// Function to open the confirmation modal
function openConfirmationModal(message, action) {
    document.getElementById('confirmationMessage').textContent = message;
    confirmationAction = action;
    document.getElementById('confirmationModal').style.display = 'flex';
}

// Function to close the confirmation modal
function closeConfirmationModal() {
    document.getElementById('confirmationModal').style.display = 'none';
    confirmationAction = null;
}

// Function to proceed with the action
function proceedAction() {
    if (confirmationAction) {
        confirmationAction();
    }
    closeConfirmationModal();
}

// Function to open the add employee modal
function openModal() {
    document.getElementById('employeeModal').style.display = 'flex';
}

// Function to close the add employee modal
function closeModal() {
    document.getElementById('employeeModal').style.display = 'none';
}

// Function to add a new employee
function addEmployee() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const dateOfEmployment = document.getElementById('dateOfEmployment').value;
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const department = document.getElementById('department').value.toLowerCase();
    const position = document.getElementById('position').value.toLowerCase();

    const formattedDateOfEmployment = formatDate(dateOfEmployment);
    const formattedDateOfBirth = formatDate(dateOfBirth);

    const newEmployee = {
        id: Date.now(),
        firstName,
        lastName,
        dateOfEmployment: formattedDateOfEmployment,
        dateOfBirth: formattedDateOfBirth,
        phone,
        email,
        department,
        position
    };

    let employees = JSON.parse(localStorage.getItem('employees')) || [];
    employees.push(newEmployee);
    localStorage.setItem('employees', JSON.stringify(employees));

    closeModal();
    displayEmployees();
    setupPagination();
}

// Function to open the edit employee modal
function openEditModal(employee) {
    document.getElementById('editEmployeeModal').style.display = 'flex';
    document.getElementById('editFirstName').value = employee.firstName;
    document.getElementById('editLastName').value = employee.lastName;

    // Convert dates to YYYY-MM-DD format for the input fields
    document.getElementById('editDateOfEmployment').value = convertToInputDateFormat(employee.dateOfEmployment);
    document.getElementById('editDateOfBirth').value = convertToInputDateFormat(employee.dateOfBirth);

    document.getElementById('editPhone').value = employee.phone;
    document.getElementById('editEmail').value = employee.email;
    // Set the selected values for the department and position dropdowns
    document.getElementById('editDepartment').value = employee.department.charAt(0).toUpperCase() + employee.department.slice(1);
    document.getElementById('editPosition').value = employee.position.charAt(0).toUpperCase() + employee.position.slice(1);
    editEmployeeId = employee.id;
}
// Helper function to convert date from dd/MM/yyyy to YYYY-MM-DD
function convertToInputDateFormat(dateString) {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
}
// Function to close the edit employee modal
function closeEditModal() {
    document.getElementById('editEmployeeModal').style.display = 'none';
}

// Function to update an existing employee
function updateEmployee() {
    openConfirmationModal(
        'Yaptığınız değişiklikleri kaydetmek istediğinizden emin misiniz?',
        () => {
            const firstName = document.getElementById('editFirstName').value;
            const lastName = document.getElementById('editLastName').value;
            const dateOfEmployment = document.getElementById('editDateOfEmployment').value;
            const dateOfBirth = document.getElementById('editDateOfBirth').value;
            const phone = document.getElementById('editPhone').value;
            const email = document.getElementById('editEmail').value;
            const department = document.getElementById('editDepartment').value.toLowerCase();
            const position = document.getElementById('editPosition').value.toLowerCase();

            const formattedDateOfEmployment = formatDate(dateOfEmployment);
            const formattedDateOfBirth = formatDate(dateOfBirth);

            let employees = JSON.parse(localStorage.getItem('employees')) || [];
            employees = employees.map(employee => {
                if (employee.id === editEmployeeId) {
                    return { ...employee, firstName, lastName, dateOfEmployment: formattedDateOfEmployment, dateOfBirth: formattedDateOfBirth, phone, email, department, position };
                }
                return employee;
            });
            localStorage.setItem('employees', JSON.stringify(employees));

            closeEditModal();
            displayEmployees();
            setupPagination();
        }
    );
}

// Function to change the language and update translations
function changeLanguage(language) {
    currentLanguage = language;

    // Update static text
    const elements = document.querySelectorAll("[data-lang]");
    elements.forEach(element => {
        const key = element.getAttribute("data-lang");
        if (translations[language][key]) {
            element.textContent = translations[language][key];
        }
    });

    // Update employee data translations
    displayEmployees();
}
