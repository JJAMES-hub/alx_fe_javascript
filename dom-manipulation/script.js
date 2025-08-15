let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Load saved filter
let savedFilter = localStorage.getItem('selectedCategory') || "all";

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Add a new quote
function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category!");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  displayQuotes();
  document.getElementById("quoteText").value = "";
  document.getElementById("quoteCategory").value = "";
}

// Populate category dropdown
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  categorySelect.innerHTML = categories
    .map(cat => `<option value="${cat}" ${cat === savedFilter ? "selected" : ""}>${cat}</option>`)
    .join("");
}

// Filter quotes
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  savedFilter = category;
  localStorage.setItem('selectedCategory', category);
  displayQuotes();
}

// Display quotes based on filter
function displayQuotes() {
  const list = document.getElementById("quoteList");
  const category = savedFilter;
  list.innerHTML = "";

  quotes
    .filter(q => category === "all" || q.category === category)
    .forEach(q => {
      const li = document.createElement("li");
      li.textContent = `"${q.text}" — ${q.category}`;
      list.appendChild(li);
    });
}

// Export quotes to JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) throw new Error("Invalid format");
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      displayQuotes();
      alert('Quotes imported successfully!');
    } catch (err) {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize
populateCategories();
displayQuotes();
