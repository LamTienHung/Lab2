const employees = [
    { id: 1, name: "Nguyen Van An", department: "IT", role: "Developer" },
    { id: 2, name: "Tran Thi Binh", department: "HR", role: "HR Specialist" },
    { id: 3, name: "Le Minh Cuong", department: "Finance", role: "Accountant" },
    { id: 4, name: "Pham Thu Dung", department: "Marketing", role: "Designer" },
    { id: 5, name: "Hoang Gia Huy", department: "IT", role: "System Administrator" },
    { id: 6, name: "Vo Ngoc Lan", department: "HR", role: "Recruiter" },
    { id: 7, name: "Dang Quoc Minh", department: "IT", role: "Frontend Developer" },
    { id: 8, name: "Bui Thanh Nam", department: "Finance", role: "Financial Analyst" },
    { id: 9, name: "Do My Linh", department: "Marketing", role: "Content Creator" },
    { id: 10, name: "Phan Duc Khoa", department: "IT", role: "Backend Developer" },
    { id: 11, name: "Truong Bao Ngoc", department: "HR", role: "HR Manager" },
    { id: 12, name: "Mai Tuan Kiet", department: "Marketing", role: "SEO Specialist" }
];

const gridBody = document.getElementById("grid-body");
const resultCount = document.getElementById("result-count");

function renderEmployees(data) {
    gridBody.replaceChildren();

    data.forEach(employee => {
        const row = document.createElement("tr");

        row.setAttribute("role", "row");
        row.dataset.employeeId = employee.id;

        row.setAttribute(
            "aria-selected",
            String(selectedEmployeeId === employee.id)
        );

        const values = [
            employee.id,
            employee.name,
            employee.department,
            employee.role
        ];

        values.forEach(value => {
            const cell = document.createElement("td");

            cell.setAttribute("role", "gridcell");
cell.tabIndex = -1;
cell.textContent = String(value);

cell.setAttribute(
    "aria-label",
    `${["ID", "Name", "Department", "Role"][row.children.length]}: ${value}`
);

cell.addEventListener("click", () => {
    gridBody.querySelectorAll('td[role="gridcell"]').forEach(item => {
        item.tabIndex = -1;
    });

    cell.tabIndex = 0;
    cell.focus();
});

            row.appendChild(cell);
        });

        gridBody.appendChild(row);
    });

    // Make the first cell accessible using Tab
    const firstCell = gridBody.querySelector('td[role="gridcell"]');

    if (firstCell) {
        firstCell.tabIndex = 0;
    }

    resultCount.textContent = `Showing ${data.length} employees`;
}

// Sorting state
let sortColumn = "id";
let sortDirection = "asc";

// Filtering state
let searchQuery = "";

// Pagination state
let currentPage = 1;
const pageSize = 5;

const prevButton = document.getElementById("prev-page");
const nextButton = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");

const searchInput = document.getElementById("search-input");

// Filter employees by name or department
function filterEmployees(data) {
    const query = searchQuery.trim().toLowerCase();

    return data.filter(employee => {
        return (
            employee.name.toLowerCase().includes(query) ||
            employee.department.toLowerCase().includes(query)
        );
    });
}

// Apply filtering and sorting together
function updateGrid() {
    // Step 1: Filter data
    const filteredData = filterEmployees(employees);

    // Step 2: Sort filtered data
    const sortedData = sortEmployees(filteredData);

    // Step 3: Calculate pagination
    const totalPages = Math.max(
        1,
        Math.ceil(sortedData.length / pageSize)
    );

    // Ensure current page is valid
    currentPage = Math.min(currentPage, totalPages);

    // Step 4: Get data for current page
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedData = sortedData.slice(startIndex, endIndex);

    // Step 5: Render current page
    renderEmployees(paginatedData);
    updateSortIndicators();

    // Step 6: Update pagination controls
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;

    // Step 7: Update result count
    resultCount.textContent =
        `Showing ${paginatedData.length} of ${filteredData.length} employees`;
}
// Handle search input
searchInput.addEventListener("input", event => {
    searchQuery = event.target.value;
    currentPage = 1;
    updateGrid();
});

// Sort employees by selected column
function sortEmployees(data) {
    return [...data].sort((a, b) => {
        const valueA = a[sortColumn];
        const valueB = b[sortColumn];

        let comparison;

        if (typeof valueA === "number" && typeof valueB === "number") {
            comparison = valueA - valueB;
        } else {
            comparison = String(valueA).localeCompare(String(valueB));
        }

        return sortDirection === "asc" ? comparison : -comparison;
    });
}

// Update sorting indicators
function updateSortIndicators() {
    document.querySelectorAll("[data-sort]").forEach(button => {
        const column = button.dataset.sort;
        const header = button.closest("th");

        header.removeAttribute("aria-sort");

        if (column === sortColumn) {
            header.setAttribute(
                "aria-sort",
                sortDirection === "asc" ? "ascending" : "descending"
            );
        }
    });
}

// Handle sorting button clicks
document.querySelectorAll("[data-sort]").forEach(button => {
    button.addEventListener("click", () => {
        const selectedColumn = button.dataset.sort;

        if (sortColumn === selectedColumn) {
            sortDirection = sortDirection === "asc" ? "desc" : "asc";
        } else {
            sortColumn = selectedColumn;
            sortDirection = "asc";
        }
        currentPage = 1;
        updateGrid();
    });
});

// Keyboard navigation
const employeeGrid = document.getElementById("employee-grid");

let selectedEmployeeId = null;

// Focus a grid cell when clicked
employeeGrid.addEventListener("click", event => {
    const cell = event.target.closest('td[role="gridcell"]');

    if (!cell) return;

    gridBody.querySelectorAll('td[role="gridcell"]').forEach(item => {
        item.tabIndex = -1;
    });

    cell.tabIndex = 0;
    cell.focus();
});

function getGridCells() {
    return Array.from(
        gridBody.querySelectorAll('td[role="gridcell"]')
    );
}

function selectRow(row, toggle = false) {
    if (!row) return;

    const employeeId = Number(row.dataset.employeeId);

    if (toggle && selectedEmployeeId === employeeId) {
        selectedEmployeeId = null;
    } else {
        selectedEmployeeId = employeeId;
    }

    gridBody.querySelectorAll("tr").forEach(item => {
        const isSelected =
            Number(item.dataset.employeeId) === selectedEmployeeId;

        item.setAttribute("aria-selected", String(isSelected));
    });
}

employeeGrid.addEventListener("keydown", event => {
    const cell = event.target.closest('td[role="gridcell"]');

    if (!cell) return;

    const row = cell.closest("tr");
    const rows = Array.from(gridBody.querySelectorAll("tr"));

    const rowIndex = rows.indexOf(row);
    const cells = Array.from(row.querySelectorAll('td[role="gridcell"]'));
    const colIndex = cells.indexOf(cell);

    let nextRow = rowIndex;
    let nextCol = colIndex;

    switch (event.key) {
        case "ArrowUp":
            nextRow--;
            break;

        case "ArrowDown":
            nextRow++;
            break;

        case "ArrowLeft":
            nextCol--;
            break;

        case "ArrowRight":
            nextCol++;
            break;

        case "Enter":
            event.preventDefault();
            selectRow(row);
            return;

        case " ":
        case "Spacebar":
            event.preventDefault();
            selectRow(row, true);
            return;

        default:
            return;
    }

    event.preventDefault();

    // Keep navigation inside the grid
    nextRow = Math.max(0, Math.min(nextRow, rows.length - 1));
    nextCol = Math.max(0, Math.min(nextCol, cells.length - 1));

    const targetRow = rows[nextRow];
    const targetCells = targetRow.querySelectorAll('td[role="gridcell"]');
    const nextCell = targetCells[nextCol];

    if (nextCell) {
        gridBody.querySelectorAll('td[role="gridcell"]').forEach(item => {
            item.tabIndex = -1;
        });

        nextCell.tabIndex = 0;
        nextCell.focus();
    }
});

// Initial render
updateGrid();

// Previous page
prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        updateGrid();
    }
});

// Next page
nextButton.addEventListener("click", () => {
    currentPage++;
    updateGrid();
});