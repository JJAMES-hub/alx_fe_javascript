 // Quotes array with text and category properties
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do what you can with all you have, wherever you are.", category: "Inspiration" }
];

// Function to display a random quote
function displayRandomQuote() {
  let randomIndex = Math.floor(Math.random() * quotes.length);
  let quote = quotes[randomIndex];
  document.getElementById("quote-text").textContent = `"${quote.text}"`;
  document.getElementById("quote-category").textContent = `— ${quote.category}`;
}

// Function to add a new quote and update the DOM
function addQuote() {
  let text = document.getElementById("new-quote-text").value.trim();
  let category = document.getElementById("new-quote-category").value.trim();

  if (text && category) {
    quotes.push({ text: text, category: category });
    document.getElementById("new-quote-text").value = "";
    document.getElementById("new-quote-category").value = "";
    displayRandomQuote();
  } else {
    alert("Please enter both a quote and a category.");
  }
}

// Event listeners
document.getElementById("new-quote-btn").addEventListener("click", displayRandomQuote);
document.getElementById("add-quote-btn").addEventListener("click", addQuote);

// Display the first quote on page load
displayRandomQuote();

