window.onclick = function(event) {
    //console.dir({nodeName: event.target.nodeName, parentNode: event.target.parentNode.nodeName, classList: event.target.className})
    if(event.target.nodeName == "A" 
    || event.target.parentNode.nodeName == "A"
    || event.target.parentNode.parentNode.nodeName == "A"
    || (event.target.nodeName == "SPAN" && event.target.parentNode.nodeName == "SPAN")
    || (event.target.nodeName == "DIV" && ["Alternative", "Prequel", "Sequel", "Source", "Spin Off", "Other", "Adaptation", "Side Story"].indexOf(event.target.innerText) > -1)
    || (event.target.nodeName == "DIV" && event.target.className == "info")) {
        if(event.target.classList.contains("link")) return;
        doThings();
    }
}
setTimeout(doThings, 1000);


window.addEventListener("popstate", function() {
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

            let counter = 0;
            let interval = setInterval(function() {
                console.log("interval"+counter)
                let container = document.querySelector(".review-wrap");
                counter++;
                if(container || counter > 5) {
                    console.log("cleared at "+counter)
                    clearInterval(interval);
                }
                reviews.forEach(rev => {
                    let content = rev.content.split(" ").splice(0, 15).join(" ")+"...";
                    let rcard = reviewCard(rev.reviewer.image_url, content, rev.helpful_count, rev.url);
                    container.appendChild(rcard);
                })
            }, 200) 
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