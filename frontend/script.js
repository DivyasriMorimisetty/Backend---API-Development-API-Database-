const API = "http://localhost:3000";

// Load employees
async function loadEmployees() {
    const res = await fetch(API + "/employees");
    const data = await res.json();

    let rows = "";
    data.forEach(emp => {
        rows += `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.employee_code}</td>
                <td>${emp.full_name}</td>
                <td>${emp.department}</td>
                <td>${emp.designation}</td>
                <td>
                    <button onclick="deleteEmployee(${emp.id})">Delete</button>
                </td>
            </tr>
        `;
    });

    document.querySelector("#employeeTable tbody").innerHTML = rows;
}

// Add employee
document.getElementById("employeeForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const emp = {
        employee_code: employee_code.value,
        full_name: full_name.value,
        email: email.value,
        phone: phone.value,
        department: department.value,
        designation: designation.value,
        salary: salary.value,
        joining_date: joining_date.value
    };

    await fetch(API + "/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emp)
    });

    e.target.reset();
    loadEmployees();
});

// Delete employee
async function deleteEmployee(id) {
    await fetch(API + "/employees/" + id, { method: "DELETE" });
    loadEmployees();
}

loadEmployees();
