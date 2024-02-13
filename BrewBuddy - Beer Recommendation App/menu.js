const apiUrl = "https://api.punkapi.com/v2/beers";

let currentPage = 1;
let pageSize = 25;

// Function to fetch beers from the API
function fetchBeers(
  page,
  perPage,
  searchQuery,
  abvChecked,
  ebcChecked,
  ibuChecked
) {
  let url = `${apiUrl}?page=${page}&per_page=${perPage}`;
  if (searchQuery) {
    url += `&beer_name=${searchQuery}`;
  }
  if (abvChecked) {
    url += `&abv_gt=6`;
  }
  if (ebcChecked) {
    url += `&ebc_gt=100`;
  }
  if (ibuChecked) {
    url += `&ibu_gt=85`;
  }

  // Fetch beers from the API
  return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Enable or disable next page button based on whether there are more beers to show
      const nextPageButton = document.getElementById("next-page");
      nextPageButton.disabled = data.length < perPage;
      return data;
    })
    .catch((error) => {
      console.error("Error fetching beers:", error);
      const errorMessage = document.createElement("div");
      errorMessage.textContent =
        "An error occurred while fetching beers. Please try again later.";
      document.getElementById("beer-list").appendChild(errorMessage);
    })
    .finally(() => {
      console.log("Fetch is completed");
    });
}

// Function to create a table header cell with the given text and tooltip
function createTableHeaderCell(text, tooltip) {
  const cell = document.createElement("th");
  cell.textContent = text;
  if (tooltip) {
    cell.title = tooltip;
  }
  return cell;
}

// Function to create a table cell with the given text
function createTableCell(text) {
  const cell = document.createElement("td");
  cell.textContent = text;
  return cell;
}

// Function to display the list of beers in a table
function displayBeers(beers) {
  const beerListDiv = document.getElementById("beer-list");
  beerListDiv.innerHTML = "";

  // Create a table element
  const table = document.createElement("table");
  table.classList.add("beer-table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  // Create table headers
  const headerRow = document.createElement("tr");
  headerRow.appendChild(createTableHeaderCell("ID"));
  headerRow.appendChild(createTableHeaderCell("Name"));
  headerRow.appendChild(createTableHeaderCell("Food Pairing"));
  headerRow.appendChild(createTableHeaderCell("ABV", "Alcohol by Volume"));
  headerRow.appendChild(
    createTableHeaderCell("EBC", "European Brewery Convention")
  );
  headerRow.appendChild(
    createTableHeaderCell("IBU", "International Bitterness Units")
  );
  headerRow.appendChild(createTableHeaderCell("First Brewed"));
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table rows for each beer
  beers.forEach((beer) => {
    const row = document.createElement("tr");
    row.appendChild(createTableCell(beer.id));
    row.appendChild(createTableCell(beer.name));
    row.appendChild(createTableCell(beer.food_pairing.join(", ")));
    row.appendChild(createTableCell(beer.abv));
    row.appendChild(createTableCell(beer.ebc));
    row.appendChild(createTableCell(beer.ibu));
    row.appendChild(createTableCell(beer.first_brewed));
    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  beerListDiv.appendChild(table);
}

// Function to update the UI with current page information
function updatePaginationUI() {
  document.getElementById("current-page").textContent = `Page ${currentPage}`;
}

// Event handler for previous page button
function handlePrevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchAndDisplayBeers();
  }
}

// Event handler for next page button
function handleNextPage() {
  currentPage++;
  fetchAndDisplayBeers();
}

// Event handler for page size change
function handlePageSizeChange() {
  pageSize = parseInt(document.getElementById("page-size").value);
  currentPage = 1;
  fetchAndDisplayBeers();
}

// Event handler for search input
function handleSearch() {
  currentPage = 1;
  fetchAndDisplayBeers();
}

// Function to fetch and display beers based on current page, page size, and search query
function fetchAndDisplayBeers() {
  const searchInput = document.getElementById("search-input").value;
  const abvFilterCheckbox = document.getElementById("abv-filter");
  const ebcFilterCheckbox = document.getElementById("ebc-filter");
  const ibuFilterCheckbox = document.getElementById("ibu-filter");

  // Fetch beers for the first page with the checkbox states
  fetchBeers(
    currentPage,
    pageSize,
    searchInput,
    abvFilterCheckbox.checked,
    ebcFilterCheckbox.checked,
    ibuFilterCheckbox.checked
  )
    .then((currentPageData) => {
      let filteredBeers = currentPageData;

      // Display filtered beers and update pagination UI
      displayBeers(filteredBeers);
      updatePaginationUI();

      // Check if there are no more beers on the next page
      const nextPageData = fetchBeers(
        currentPage + 1,
        pageSize,
        searchInput,
        abvFilterCheckbox.checked,
        ebcFilterCheckbox.checked,
        ibuFilterCheckbox.checked
      );
      nextPageData.then((data) => {
        const nextPageButton = document.getElementById("next-page");
        nextPageButton.disabled = data.length === 0;
      });

      // Check if the search input does not match any beers
      if (filteredBeers.length === 0 && searchInput.trim() !== "") {
        const errorMessage = document.createElement("div");
        errorMessage.textContent =
          "We don't have that beer in our offer. Please search again.";
        errorMessage.id = "error-message";
        document.getElementById("beer-list").appendChild(errorMessage);
      } else {
        const existingErrorMessage = document.getElementById("error-message");
        if (existingErrorMessage) {
          existingErrorMessage.remove();
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching beers:", error);
      const errorMessage = document.createElement("div");
      errorMessage.textContent =
        "An error occurred while fetching beers. Please try again later.";
      document.getElementById("beer-list").appendChild(errorMessage);
    });
}

// Event handler for checkboxes
function handleCheckboxChange() {
  currentPage = 1;
  fetchAndDisplayBeers();
}

// Add event listeners to buttons and inputs
document.getElementById("prev-page").addEventListener("click", handlePrevPage);
document.getElementById("next-page").addEventListener("click", handleNextPage);
document
  .getElementById("page-size")
  .addEventListener("change", handlePageSizeChange);
document.getElementById("search-input").addEventListener("input", handleSearch);
document
  .getElementById("abv-filter")
  .addEventListener("change", handleCheckboxChange);
document
  .getElementById("ebc-filter")
  .addEventListener("change", handleCheckboxChange);
document
  .getElementById("ibu-filter")
  .addEventListener("change", handleCheckboxChange);

// Initial fetch and display of beers
fetchAndDisplayBeers();
