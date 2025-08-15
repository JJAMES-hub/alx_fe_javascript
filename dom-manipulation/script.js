// ====== QUOTES ARRAY ======
let quotes = [];

// ====== LOAD FROM LOCAL STORAGE ON START ======
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  } else {
    quotes = [
      "The best way to get started is to quit talking and begin doing.",
      "Don’t let yesterday take up too much of today.",
      "It’s not whether you get knocked down, it’s whether you get up."
    ];
    saveQuotes();
  }
}

// ====== SAVE TO LOCAL STORAGE ======
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ====== DISPLAY RANDOM QUOTE ======
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  document.getElementById("quoteDisplay").textContent = quote;
  sessionStorage.setItem("lastQuote", quote); // Example of session storage
}

// ====== ADD NEW QUOTE ======
function addQuote(newQuote) {
  if (newQuote.trim() !== "") {
    quotes.push(newQuote);
    saveQuotes();
    alert("Quote added!");
  }
}

// ====== EXPORT QUOTES AS JSON ======
document.getElementById("exportBtn").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
});

// ====== IMPORT QUOTES FROM JSON FILE ======
document.getElementById("importFile").addEventListener("change", (event) => {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON format! Please upload an array of quotes.");
      }
    } catch {
      alert("Error reading JSON file!");
    }
  };
  fileReader.readAsText(event.target.files[0]);
});

// ====== CLEAR STORAGE BUTTON ======
document.getElementById("clearStorageBtn").addEventListener("click", () => {
  localStorage.removeItem("quotes");
  alert("Stored quotes cleared!");
  loadQuotes(); // Reload default quotes
  document.getElementById("quoteDisplay").textContent = "Quotes cleared! Click 'Show Random Quote' to reload.";
});

// ====== EVENT LISTENERS ======
document.getElementById("showQuoteBtn").addEventListener("click", displayRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", () => {
  const newQuote = prompt("Enter your new quote:");
  if (newQuote) addQuote(newQuote);
});

// ====== INIT ======
loadQuotes();

// ====== SHOW LAST QUOTE FROM SESSION STORAGE ======
if (sessionStorage.getItem("lastQuote")) {
  document.getElementById("quoteDisplay").textContent =
    `Last viewed: "${sessionStorage.getItem("lastQuote")}"`;
}
