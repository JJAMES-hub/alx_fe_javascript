// ======= Simulated Server State =======
let simulatedServerQuotes = [
  { id: 1, text: "The journey of a thousand miles begins with a single step.", category: "Motivation", updatedAt: Date.now() },
  { id: 2, text: "Life is what happens when you're busy making other plans.", category: "Life", updatedAt: Date.now() },
  { id: 3, text: "The best way to predict the future is to invent it.", category: "Innovation", updatedAt: Date.now() }
];

// ======= Local State =======
let quotes = JSON.parse(localStorage.getItem("quotes")) || [...simulatedServerQuotes];
let savedFilter = localStorage.getItem('selectedCategory') || "all";

// ======= Populate Category Dropdown =======
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

// ======= Display a Random Quote =======
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

// ======= Handle Filter Change =======
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  savedFilter = category;
  localStorage.setItem('selectedCategory', category);
  displayRandomQuote();
}

// ======= Add New Quote =======
function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (!text || !category) {
    alert("Please enter both quote and category");
    return;
  }

  const newQuote = {
    id: Date.now(),
    text,
    category,
    updatedAt: Date.now()
  };

  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes));

  // Simulate sending to server
  simulatedServerQuotes.push(newQuote);

  populateCategories();
  displayRandomQuote();

  document.getElementById("quoteText").value = "";
  document.getElementById("quoteCategory").value = "";
}

// ======= Conflict Resolution (Server Wins) =======
function syncWithServer() {
  let changesDetected = false;

  simulatedServerQuotes.forEach(serverQuote => {
    const localQuote = quotes.find(q => q.id === serverQuote.id);
    if (!localQuote) {
      // New quote on server, add locally
      quotes.push(serverQuote);
      changesDetected = true;
    } else if (serverQuote.updatedAt > localQuote.updatedAt) {
      // Server quote updated after local version
      Object.assign(localQuote, serverQuote);
      changesDetected = true;
    }
  });

  // Save merged data to localStorage
  localStorage.setItem("quotes", JSON.stringify(quotes));

  if (changesDetected) {
    showNotification("Quotes have been updated from the server.");
    populateCategories();
    displayRandomQuote();
  }
}

// ======= Show Notification =======
function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => notification.style.display = "none", 3000);
}

// ======= Simulate Server Update Every 15s =======
setInterval(() => {
  // Simulate someone else adding a quote on the server
  const newServerQuote = {
    id: Date.now(),
    text: "Server says hello at " + new Date().toLocaleTimeString(),
    category: "Server Updates",
    updatedAt: Date.now()
  };
  simulatedServerQuotes.push(newServerQuote);
}, 15000);

// ======= Sync with Server Every 10s =======
setInterval(syncWithServer, 10000);

// ======= Initialize =======
populateCategories();
displayRandomQuote();
