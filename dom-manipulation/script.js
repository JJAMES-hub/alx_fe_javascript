// ========== DATA ==========
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Your limitation—it’s only your imagination.", category: "Inspiration" },
  { text: "Push yourself, because no one else is going to do it for you.", category: "Discipline" }
];

// ========== DOM ELEMENTS ==========
const quoteDisplay = document.getElementById("quoteDisplay");
const quoteList = document.getElementById("quoteList");
const categoryFilter = document.getElementById("categoryFilter");
const toastContainer = document.getElementById("toastContainer");

// ========== STORAGE ==========
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const stored = localStorage.getItem("quotes");
  if (stored) quotes = JSON.parse(stored);
}

// ========== RENDERING ==========
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available.";
    return;
  }
  const filtered = filterQuotes(false);
  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.textContent = `"${random.text}" — [${random.category}]`;

  sessionStorage.setItem("lastQuote", JSON.stringify(random));
}

function renderQuotes(list = quotes) {
  quoteList.innerHTML = "";
  list.forEach(q => {
    const li = document.createElement("li");
    li.textContent = `"${q.text}" — [${q.category}]`;
    quoteList.appendChild(li);
  });
}

function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
  const savedFilter = localStorage.getItem("selectedCategory");
  if (savedFilter) categoryFilter.value = savedFilter;
}

// ========== ADD QUOTE ==========
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) {
    showToast("Please enter both quote and category!");
    return;
  }
  const newQuote = { text, category, updatedAt: Date.now() };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  renderQuotes();
  showToast("Quote added successfully!");
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// ========== FILTER ==========
function filterQuotes(update = true) {
  const selected = categoryFilter.value;
  if (update) localStorage.setItem("selectedCategory", selected);
  if (selected === "all") {
    renderQuotes(quotes);
    return quotes;
  } else {
    const filtered = quotes.filter(q => q.category === selected);
    renderQuotes(filtered);
    return filtered;
  }
}

// ========== JSON IMPORT/EXPORT ==========
function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  showToast("Quotes exported!");
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(ev) {
    try {
      const importedQuotes = JSON.parse(ev.target.result);
      importedQuotes.forEach(iq => {
        if (!quotes.some(q => q.text === iq.text)) {
          quotes.push({ ...iq, updatedAt: Date.now() });
        }
      });
      saveQuotes();
      populateCategories();
      renderQuotes();
      showToast("Quotes imported successfully!");
    } catch {
      showToast("Invalid JSON file!");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ========== SYNC WITH SERVER ==========
async function fetchQuotesFromServer() {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
  const data = await res.json();
  return data.map(d => ({
    text: d.title,
    category: "Server",
    updatedAt: Date.now()
  }));
}

async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
  let conflicts = 0;

  serverQuotes.forEach(sq => {
    const local = quotes.find(q => q.text === sq.text);
    if (!local) {
      quotes.push(sq);
    } else {
      if (sq.updatedAt > (local.updatedAt || 0)) {
        Object.assign(local, sq);
        conflicts++;
      }
    }
  });

  saveQuotes();
  populateCategories();
  renderQuotes();
  showToast(`Sync complete. Conflicts resolved: ${conflicts}`);
  document.getElementById("syncLog").textContent = `Last sync: ${new Date().toLocaleTimeString()}`;
}

// ========== TOAST ==========
function showToast(msg) {
  const div = document.createElement("div");
  div.className = "toast";
  div.textContent = msg;
  toastContainer.appendChild(div);
  setTimeout(() => div.remove(), 3000);
}

// ========== INIT ==========
window.onload = () => {
  loadQuotes();
  populateCategories();
  filterQuotes();
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const q = JSON.parse(lastQuote);
    quoteDisplay.textContent = `"${q.text}" — [${q.category}]`;
  } else {
    showRandomQuote();
  }
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
};

