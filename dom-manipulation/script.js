// Array to hold quotes
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don't let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It's not whether you get knocked down, it's whether you get up.", category: "Perseverance" }
];

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  document.getElementById("quoteDisplay").innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>— ${randomQuote.category}</small>
  `;
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Push new quote into the array
  quotes.push({ text: quoteText, category: quoteCategory });

  // Clear the input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Update the DOM by showing a new random quote
  showRandomQuote();
}

// Event listener for the "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Show an initial quote on page load
showRandomQuote();
