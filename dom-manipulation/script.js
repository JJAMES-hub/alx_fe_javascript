
let quotes = [];
let lastFilter = "all";

// Load quotes from Local Storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
  lastFilter = localStorage.getItem("lastFilter") || "all";
  populateCategories();
  displayQuotes();
}

// Save quotes to Local Storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Add new quote
function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const author = document.getElementById("quoteAuthor").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (!text || !author || !category) {
    alert("Please fill all fields.");
    return;
  }

  quotes.push({ text, author, category });
  saveQuotes();
  populateCategories();
  displayQuotes();

  document.getElementById("quoteText").value = "";
  document.getElementById("quoteAuthor").value = "";
  document.getElementById("quoteCategory").value = "";
}

// Display quotes based on selected category
function displayQuotes() {
  const container = document.getElementById("quoteDisplay");
  container.innerHTML = "";

  const filteredQuotes = lastFilter === "all"
    ? quotes
    : quotes.filter(q => q.category === lastFilter);

  if (filteredQuotes.length === 0) {
    container.innerHTML = "<p>No quotes available.</p>";
    return;
  }

  filteredQuotes.forEach(q => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>"${q.text}"</strong> - ${q.author} <em>(${q.category})</em>`;
    container.appendChild(div);
  });
}

// Populate categories in dropdown
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");
  categorySelect.innerHTML = `<option value="all">All Categories</option>`;

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categorySelect.appendChild(option);
  });

  categorySelect.value = lastFilter;
}

// Filter quotes and save filter preference
function filterQuotes() {
  lastFilter = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastFilter", lastFilter);
  displayQuotes();
}

// Export quotes as JSON file
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize
loadQuotes();
