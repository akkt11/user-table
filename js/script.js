const table = document.querySelector("table");
const tBody = table.tBodies[0];
const notification = document.getElementById("notification");
const buttonRefresh = document.getElementById("btn");
const loaderWrapper = document.createElement("div");
const loader = document.createElement("span");

loaderWrapper.classList = "loader-wrapper";
loader.classList = "loader";

loaderWrapper.appendChild(loader);
tBody.appendChild(loaderWrapper);

buttonRefresh.addEventListener("click", () => renderUsers());

const getUsers = async () => {
  loaderWrapper.classList.add("show");
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();

    if (!response.ok) {
      throw new Error("Error: Couldn't get users!");
    }

    loaderWrapper.classList.remove("show");
    return data;
  } catch (error) {
    notification.classList.add("show");
    loaderWrapper.classList.add("show");
    notification.innerHTML = error.message;
  }
};

table.querySelectorAll("th").forEach((cell) => {
  cell.addEventListener("click", () => {
    const cellIndex = Array.prototype.indexOf.call(
      cell.parentElement.children,
      cell
    );
    if (cell.classList.contains("sort")) {
      const isAscending = cell.classList.contains("th-sort-asc");
      sortTableByColumn(cellIndex, !isAscending);
    }
  });
});

const sortTableByColumn = (column, asc = true) => {
  const order = asc ? 1 : -1;
  const rows = Array.from(tBody.querySelectorAll("tr"));

  const sortedRows = rows.sort((a, b) => {
    const aColumn = a
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();
    const bColumn = b
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();

    return aColumn > bColumn ? 1 * order : -1 * order;
  });

  tBody.append(...sortedRows);

  table
    .querySelectorAll("th")
    .forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-asc", asc);
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-desc", !asc);
};

const renderUsers = async () => {
  const users = await getUsers();

  if (!users) return;

  table
    .querySelectorAll("th")
    .forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));

  tBody.querySelectorAll("tr").forEach((elem) => {
    tBody.removeChild(elem);
  });

  users.forEach((user) => {
    const row = document.createElement("tr");

    const name = document.createElement("td");
    name.innerHTML = user.name;
    name.setAttribute("data-title", "name");

    const email = document.createElement("td");
    email.innerHTML = user.email;
    email.setAttribute("data-title", "email");

    const phone = document.createElement("td");
    phone.innerHTML = user.phone;
    phone.setAttribute("data-title", "phone");

    row.append(name);
    row.append(email);
    row.append(phone);

    tBody.append(row);
  });
};

renderUsers();
