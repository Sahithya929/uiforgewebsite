// Quotes array - each quote has text and author
const quotes = [
  { text: "The only true wisdom is in knowing you know nothing.", author: "Socrates" },
  { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Happiness depends upon ourselves.", author: "Aristotle" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" }
];

// DOM elements
const quoteTextEl = document.getElementById("quoteText");
const quoteAuthorEl = document.getElementById("quoteAuthor");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const saveQuoteBtn = document.getElementById("saveQuoteBtn");
const favoriteBtn = document.getElementById("favoriteBtn");
const toggleFavoritesBtn = document.getElementById("toggleFavoritesBtn");
const toggleSavedBtn = document.getElementById("toggleSavedBtn");
const favoritesSidebar = document.getElementById("favoritesSidebar");
const favoriteQuotesList = document.getElementById("favoriteQuotesList");
const savedSidebar = document.getElementById("savedSidebar");
const savedQuotesList = document.getElementById("savedQuotesList");

let currentQuoteIndex = null;

// Load saved data from localStorage or initialize
let savedQuotes = JSON.parse(localStorage.getItem("savedQuotes")) || [];
let favoriteQuotes = JSON.parse(localStorage.getItem("favoriteQuotes")) || [];

// Utility: Save to localStorage
function persistData() {
  localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
  localStorage.setItem("favoriteQuotes", JSON.stringify(favoriteQuotes));
}

// Show a quote by index
function showQuote(index) {
  currentQuoteIndex = index;
  const quote = quotes[index];
  
  // Smooth fade out/in effect
  quoteTextEl.style.opacity = 0;
  quoteAuthorEl.style.opacity = 0;

  setTimeout(() => {
    quoteTextEl.textContent = `"${quote.text}"`;
    quoteAuthorEl.textContent = `- ${quote.author}`;
    
    quoteTextEl.style.opacity = 1;
    quoteAuthorEl.style.opacity = 1;

    updateButtons();
  }, 300);
}

// Update button states depending on saved/favorited status
function updateButtons() {
  const currentQuote = quotes[currentQuoteIndex];
  
  // Check if current quote is saved (compare by text + author)
  const isSaved = savedQuotes.some(q => q.text === currentQuote.text && q.author === currentQuote.author);
  const isFavorited = favoriteQuotes.some(q => q.text === currentQuote.text && q.author === currentQuote.author);

  // Save button toggle
  if (isSaved) {
    saveQuoteBtn.classList.add("saved");
    saveQuoteBtn.textContent = "Quote Saved";
  } else {
    saveQuoteBtn.classList.remove("saved");
    saveQuoteBtn.textContent = "Save Quote";
  }

  // Favorite button toggle
  if (isFavorited) {
    favoriteBtn.classList.add("favorited");
    favoriteBtn.textContent = "❤️ Favorited";
  } else {
    favoriteBtn.classList.remove("favorited");
    favoriteBtn.textContent = "♡ Favourite";
  }
}

// Pick a random index different from current
function getRandomIndex() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * quotes.length);
  } while (newIndex === currentQuoteIndex && quotes.length > 1);
  return newIndex;
}

// Add or remove quote from savedQuotes
function toggleSaveQuote() {
  const currentQuote = quotes[currentQuoteIndex];
  const index = savedQuotes.findIndex(q => q.text === currentQuote.text && q.author === currentQuote.author);

  if (index === -1) {
    savedQuotes.push(currentQuote);
  } else {
    savedQuotes.splice(index, 1);
  }
  persistData();
  updateButtons();
  renderSavedList();
}

// Add or remove quote from favoriteQuotes and update sidebar
function toggleFavoriteQuote() {
  const currentQuote = quotes[currentQuoteIndex];
  const index = favoriteQuotes.findIndex(q => q.text === currentQuote.text && q.author === currentQuote.author);

  if (index === -1) {
    favoriteQuotes.push(currentQuote);
  } else {
    favoriteQuotes.splice(index, 1);
  }
  persistData();
  updateButtons();
  renderFavoritesList();
}

// Render favorite quotes in sidebar
function renderFavoritesList() {
  favoriteQuotesList.innerHTML = "";

  if (favoriteQuotes.length === 0) {
    favoriteQuotesList.innerHTML = "<li>No favorite quotes yet.</li>";
    return;
  }

  favoriteQuotes.forEach((quote, i) => {
    const li = document.createElement("li");
    li.textContent = `"${quote.text}" — ${quote.author}`;

    // Remove button for each favorite
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✖";
    removeBtn.title = "Remove from favorites";
    removeBtn.style.marginLeft = "10px";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.border = "none";
    removeBtn.style.background = "transparent";
    removeBtn.style.color = "#e74c3c";
    removeBtn.style.fontWeight = "bold";

    removeBtn.addEventListener("click", () => {
      favoriteQuotes.splice(i, 1);
      persistData();
      renderFavoritesList();
      updateButtons();
    });

    li.appendChild(removeBtn);
    favoriteQuotesList.appendChild(li);
  });
}

// Render saved quotes in sidebar
function renderSavedList() {
  savedQuotesList.innerHTML = "";

  if (savedQuotes.length === 0) {
    savedQuotesList.innerHTML = "<li>No saved quotes yet.</li>";
    return;
  }

  savedQuotes.forEach((quote, i) => {
    const li = document.createElement("li");
    li.textContent = `"${quote.text}" — ${quote.author}`;

    // Remove button for each saved quote
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "✖";
    removeBtn.title = "Remove from saved quotes";
    removeBtn.style.marginLeft = "10px";
    removeBtn.style.cursor = "pointer";
    removeBtn.style.border = "none";
    removeBtn.style.background = "transparent";
    removeBtn.style.color = "#27ae60";
    removeBtn.style.fontWeight = "bold";

    removeBtn.addEventListener("click", () => {
      savedQuotes.splice(i, 1);
      persistData();
      renderSavedList();
      updateButtons();
    });

    li.appendChild(removeBtn);
    savedQuotesList.appendChild(li);
  });
}

// Toggle favorite sidebar visibility
function toggleFavoritesSidebar() {
  favoritesSidebar.classList.toggle("visible");
  adjustMainMargin();
}

// Toggle saved sidebar visibility
function toggleSavedSidebar() {
  savedSidebar.classList.toggle("visible");
  adjustMainMargin();
}

// Adjust main content margin based on visible sidebars
function adjustMainMargin() {
  const mainEl = document.querySelector("main");
  const favVisible = favoritesSidebar.classList.contains("visible");
  const savedVisible = savedSidebar.classList.contains("visible");

  if (favVisible && savedVisible) {
    mainEl.style.marginLeft = "600px";
  } else if (favVisible || savedVisible) {
    mainEl.style.marginLeft = "300px";
  } else {
    mainEl.style.marginLeft = "0";
  }
}

// Event listeners
newQuoteBtn.addEventListener("click", () => {
  showQuote(getRandomIndex());
});

saveQuoteBtn.addEventListener("click", toggleSaveQuote);

favoriteBtn.addEventListener("click", toggleFavoriteQuote);

toggleFavoritesBtn.addEventListener("click", toggleFavoritesSidebar);

toggleSavedBtn.addEventListener("click", toggleSavedSidebar);

// Initialize
window.onload = () => {
  if (quotes.length > 0) {
    showQuote(0);
    renderFavoritesList();
    renderSavedList();
    adjustMainMargin();
  }
};
