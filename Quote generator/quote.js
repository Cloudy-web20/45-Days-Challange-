let QuoteBtn = document.querySelector("#quote-gen");
let QuoteCall = document.querySelector("#quote-call");
let FavoritesList = document.querySelector("#favorites-list");


async function quote_api() {
    try {
        const res = await fetch("https://dummyjson.com/quotes/random");
        const data = await res.json();

        QuoteCall.classList.remove("show");

        setTimeout(() => {
            QuoteCall.innerHTML = `${data.quote} <br> - <em>${data.author}</em>`;
            QuoteCall.classList.add("show");
        }, 250);

    } catch (error) {
        console.error("Failed to fetch", error);
        QuoteCall.innerHTML = "⚠️ Could not fetch quote. Please try again.";
        QuoteCall.classList.add("show");
    }
}


function saveFavorite() {
    if (!QuoteCall.innerText.trim()) {
        alert("Generate a quote first!");
        return;
    }

    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.includes(QuoteCall.innerText)) {
        favorites.push(QuoteCall.innerText);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        renderFavorites();
    } else {
        alert("This quote is already in favorites!");
    }
}


function renderFavorites() {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    FavoritesList.innerHTML = "";
    favorites.forEach(q => {
        let li = document.createElement("li");
        li.textContent = q;
        FavoritesList.appendChild(li);
    });
}


function toggleTheme() {
    if (document.body.classList.contains("light-mode")) {
        document.body.classList.remove("light-mode");
        document.body.classList.add("dark-theme");
    } else if (document.body.classList.contains("dark-theme")) {
        document.body.classList.remove("dark-theme");
    } else {
        document.body.classList.add("light-mode");
    }
}
li.innerHTML = quote + ' <button class="remove-btn">X</button>';
li.querySelector('.remove-btn').addEventListener('click', () => {
    favoritesList.removeChild(li);
});


renderFavorites();


