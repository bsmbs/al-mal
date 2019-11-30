window.onclick = function(event) {
    if(event.target.nodeName == "A" || event.target.parentNode.nodeName == "A") {
        if(event.target.classList.contains("link")) return;
        
        doThings();
    }
}
setTimeout(doThings, 1000);


window.addEventListener("popstate", function() {
    clearThings();
    setTimeout(doThings, 1000);
})

function clearThings() {
    document.querySelectorAll(".almal").forEach(item => item.remove());
}

function doThings() {
    clearThings();
    let title = document.querySelector('h1').innerText;
    let contentType = window.location.pathname.split("/")[1];
    fetchThings(title, contentType)
    .then(result => {
        let parent = document.querySelector(".sidebar .data");

        let mids = document.querySelectorAll(".sidebar .data .data-set");
        let mid = [].find.call(mids, function(s) {
            return s.childNodes[0].innerText == "Genres";
        });

        // MAL Score
        let score = dataSet();

        let scoreT = tElement("MAL Score");
        let scoreV = vElement(result.score);

        score.append(scoreT, scoreV)

        // Rating
        if(contentType == "anime") {
            let rating = dataSet();

            let ratingT = tElement("Rating");
            let ratingV = vElement(result.rated);
    
            rating.append(ratingT, ratingV);
            parent.insertBefore(rating, mid.nextSibling);
        }
        

        // Go to MyAnimeList
        let link = dataSet();
        
        let linkType = document.createElement("a");
        linkType.innerText = "Go to MyAnimeList";
        linkType.style.color = "rgb(var(--color-blue))";
        linkType.style.fontSize = "1.3rem";
        linkType.style.fontWeight = "500";
        linkType.style.paddingBottom = "5px";
        linkType.href = result.url;

        link.appendChild(linkType);

        // Insert in sidebar
        parent.insertBefore(score, parent.firstChild);
        parent.insertBefore(link, parent.firstChild);
        // Reviews
        fetchReviews(result.mal_id, contentType)
        .then(reviews => {
            reviews.length = 5;

            let container = document.querySelector(".review-wrap");
            reviews.forEach(rev => {
                let content = rev.content.split(" ").splice(0, 15).join(" ")+"...";
                let rcard = reviewCard(rev.reviewer.image_url, content, rev.helpful_count, rev.url);
                container.appendChild(rcard);
            })
            
        })
    });
    
}

async function fetchThings(query, type) {
    let request = await fetch(`https://api.jikan.moe/v3/search/${type}?q=${encodeURIComponent(query)}&limit=5`);
    if(request.ok) {
        let data = await request.json();
        const chances = match(query, data.results);
        return data.results[chances.index];
    } else {
        console.error("Failed to fetch data from jikan.moe")
    }
}

async function fetchReviews(id, type) {
    let request = await fetch(`https://api.jikan.moe/v3/${type}/${id}/reviews`);
    if(request.ok) {
        let data = await request.json();
        return data.reviews;
    } else {
        console.error("Failed to fetch reviews from jikan.moe");
    }
}
function match(query, results) {
    const res = findBestMatch(query, results.map(x => x.title));
    return { index: res.bestMatchIndex, rating: res.bestMatch.rating}
}