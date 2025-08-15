// Initial quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The journey of a thousand miles begins with a single step.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The best way to predict the future is to invent it.", category: "Innovation" }
];

let savedFilter = localStorage.getItem('selectedCategory') || "all";

// Populate category dropdown
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === savedFilter) option.selected = true;
    categoryFilter.appendChild(option);
  });
}

// Filter and show a random quote
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  savedFilter = category;
  localStorage.setItem('selectedCategory', category);
  displayRandomQuote();
}

// Show random quote in quoteDisplay
function displayRandomQuote() {
  const category = savedFilter;
  let filteredQuotes = quotes.filter(q => category === "all" || q.category === category);

  const quoteDisplay = document.getElementById("quoteDisplay");
  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes found for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category");
    return;
  }

  quotes.push({ text, category });
  localStorage.setItem("quotes", JSON.stringify(quotes));

  populateCategories();
  displayRandomQuote();

  document.getElementById("quoteText").value = "";
  document.getElementById("quoteCategory").value = "";
}

// Initialize
populateCategories();
displayRandomQuote();
