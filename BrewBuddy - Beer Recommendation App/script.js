// Fetch
function fetchRandomBeer() {
  fetch("https://api.punkapi.com/v2/beers/random")
    .then((response) => response.json())
    .then((data) => {
      const randomBeer = data[0];
      displayBeer(randomBeer);
    })
    .catch((error) => {
      console.error("Error:", error);
    })
    .finally(() => {
      console.log("Fetch is completed.");
    });
}

// Function to display the beer information
function displayBeer(beer) {
  // Select elements
  const beerImageElement = document.getElementById("beer-image");
  const beerNameElement = document.getElementById("beer-name");
  const beerABVElement = document.getElementById("beer-ABV");
  const beerIBUElement = document.getElementById("beer-IBU");
  const beerEBCElement = document.getElementById("beer-EBC");
  const beerDescriptionElement = document.getElementById("beer-description");

  // Array of default image URLs
  const defaultImages = [
    "photos/praha0.png",
    "photos/praha1.png",
    "photos/praha2.png",
    "photos/praha3.png",
    "photos/praha4.png",
    "photos/praha5.png",
  ];

  // Add error handling for the beer image
  if (beer.image_url) {
    beerImageElement.src = beer.image_url;
    beerImageElement.alt = beer.name;
  } else {
    const randomIndex = Math.floor(Math.random() * defaultImages.length);
    const randomDefaultImage = defaultImages[randomIndex];

    // Set the beer image source to the random default image
    beerImageElement.src = randomDefaultImage;
    beerImageElement.alt = "Default beer image";
  }

  // Update HTML elements with the beer information

  beerNameElement.textContent = `Name: ${beer.name}`;
  beerABVElement.innerHTML = `ABV (<a href="https://en.wikipedia.org/wiki/Alcohol_by_volume" target="_blank">${abbreviationDefinitions.abv}</a>): ${beer.abv}`;
  beerIBUElement.innerHTML = `IBU (<a href="https://beerandbrewing.com/dictionary/eej03p6ZUI/" target="_blank">${abbreviationDefinitions.ibu}</a>): ${beer.ibu}`;
  beerEBCElement.innerHTML = `EBC (<a href="https://en.wikipedia.org/wiki/European_Brewery_Convention" target="_blank">${abbreviationDefinitions.ebc}</a>): ${beer.ebc}`;
  beerDescriptionElement.innerHTML = `<strong>Description:</strong> ${beer.description}`;

  // Select the <a> elements within beer details for styling
  const beerABVLink = beerABVElement.querySelector("a");
  const beerIBULink = beerIBUElement.querySelector("a");
  const beerEBCLink = beerEBCElement.querySelector("a");

  // Add a class to the <a> elements for styling
  beerABVLink.classList.add("beer-link");
  beerIBULink.classList.add("beer-link");
  beerEBCLink.classList.add("beer-link");
}

// Object mapping abbreviations to full definitions
const abbreviationDefinitions = {
  abv: "Alcohol by volume",
  ibu: "International Bitterness Units",
  ebc: "European Brewery Convention",
};

// Call the fetchRandomBeer function to initiate the API request for a random beer
fetchRandomBeer();

// Add event listener to the "Regenerate" button to fetch a new random beer when clicked
const regenerateButton = document.getElementById("regenerate-btn");
regenerateButton.addEventListener("click", fetchRandomBeer);
