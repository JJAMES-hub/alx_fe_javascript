// ======= Initial Quotes =======
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// ======= DOM References =======
const quoteDisplay = document.getElementById("quoteDisplay");
const categoryFilter = document.getElementById("categoryFilter");
const notificationArea = document.getElementById("notificationArea");

// ======= Populate Category Filter =======
function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))];
    categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
    categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        categoryFilter.appendChild(opt);
    });

    // Restore last selected category
    const savedCategory = localStorage.getItem("selectedCategory");
    if (savedCategory) {
        categoryFilter.value = savedCategory;
        filterQuotes();
    }
}

// ======= Filter Quotes =======
function filterQuotes() {
    const selectedCategory = categoryFilter.value;
    localStorage.setItem("selectedCategory", selectedCategory);

    let filtered = quotes;
    if (selectedCategory !== "all") {
        filtered = quotes.filter(q => q.category === selectedCategory);
    }

    displayQuotes(filtered);
}

// ======= Display Quotes =======
function displayQuotes(quotesToShow) {
    quoteDisplay.innerHTML = "";
    quotesToShow.forEach(q => {
        const div = document.createElement("div");
        div.classList.add("quote-item");
        div.innerHTML = `<p>"${q.text}"</p><small>- ${q.author} (${q.category})</small>`;
        quoteDisplay.appendChild(div);
    });
}

// ======= Add Quote =======
function addQuote(text, author, category) {
    const newQuote = { id: Date.now(), text, author, category };
    quotes.push(newQuote);
    localStorage.setItem("quotes", JSON.stringify(quotes));
    populateCategories();
    filterQuotes();
    postQuoteToServer(newQuote);
}

// ======= Server Interaction =======
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Fetch quotes from server
async function fetchQuotesFromServer() {
    try {
        const res = await fetch(SERVER_URL);
        if (!res.ok) throw new Error("Server fetch failed");
        const data = await res.json();

        // Simulate quotes from server
        return data.slice(0, 5).map(item => ({
            id: item.id,
            text: item.title,
            author: `Author ${item.userId}`,
            category: ["Inspiration", "Humor", "Life"][item.id % 3]
        }));
    } catch (err) {
        console.error(err);
        return [];
    }
}

// Post new quote to server
async function postQuoteToServer(quote) {
    try {
        await fetch(SERVER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quote)
        });
    } catch (err) {
        console.error("Error posting to server:", err);
    }
}

// ======= Sync & Conflict Resolution =======
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();

    let changesMade = false;
    const localQuoteIds = new Set(quotes.map(q => q.id));

    // Add server quotes that are missing locally
    serverQuotes.forEach(sq => {
        if (!localQuoteIds.has(sq.id)) {
            quotes.push(sq);
            changesMade = true;
        }
    });

    // Server wins: replace local quotes with same ID
    quotes = quotes.map(lq => {
        const match = serverQuotes.find(sq => sq.id === lq.id);
        return match ? match : lq;
    });

    if (changesMade) {
        localStorage.setItem("quotes", JSON.stringify(quotes));
        populateCategories();
        filterQuotes();
        showNotification("Quotes updated from server.");
    }
}

// ======= Notifications =======
function showNotification(message) {
    notificationArea.textContent = message;
    notificationArea.style.display = "block";
    setTimeout(() => {
        notificationArea.style.display = "none";
    }, 3000);
}

// ======= Init =======
document.addEventListener("DOMContentLoaded", () => {
    populateCategories();
    filterQuotes();
    syncQuotes(); // Initial sync
    setInterval(syncQuotes, 60000); // Sync every 60s
});
