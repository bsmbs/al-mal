let currentId, contentType;

window.onclick = function(event) {
    //console.dir({action: 'click', nodeName: event.target.nodeName, parentNode: event.target.parentNode.nodeName, classList: event.target.className, el: event.target})
    // Reviews
    if(event.target.classList.contains("link") && event.target.innerText == "Reviews") {
        reviewThings();
    }

    // Overview
    if(event.target.nodeName == "A" 
    || event.target.parentNode.nodeName == "A"
    || event.target.parentNode.parentNode.nodeName == "A"
    || (event.target.nodeName == "SPAN" && event.target.parentNode.nodeName == "SPAN")
    || (event.target.nodeName == "DIV" && ["Alternative", "Prequel", "Sequel", "Source", "Spin Off", "Other", "Adaptation", "Side Story"].indexOf(event.target.innerText) > -1)
    || (event.target.nodeName == "DIV" && event.target.className == "info")) {
        if(event.target.classList.contains("link")) return;
        if(event.target.classList.contains("almal")) return;
        //console.log("doing things")
        loading();
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
    contentType = window.location.pathname.split("/")[1];
    const format = [].find.call(document.querySelectorAll(".sidebar .data .data-set"), function(s) {return s.childNodes[0].innerText == "Format";}).childNodes[2].innerText;

    fetchThings(title, contentType, format)
    .then(result => {
        clearThings();
        currentId = result.mal_id;
        initThings();

        let parent = document.querySelector(".sidebar .data");
        let mids = document.querySelectorAll(".sidebar .data .data-set");
        let mid = [].find.call(mids, function(s) {
            return s.childNodes[0].innerText == "Favorites";
        });

        /*                   */
        /*      Sidebar      */
        /*                   */

        // MAL Score
        let score = dataSet();

        let scoreT = tElement("MAL Score");
        let scoreV = vElement(result.score);

        score.append(scoreT, scoreV)
        // Rating
        if(contentType == "anime") {
            let rating = dataSet();

            let ratingT = tElement("Rating");
            let ratingV = vElement(result.rating);
    
            rating.append(ratingT, ratingV);
            parent.insertBefore(rating, mid.nextSibling);
        }

        // Broadcast
        if(contentType == "anime") {
            let broadcast = dataSet();

            let broadcastT = tElement("Broadcast");
            let broadcastV = vElement(result.broadcast);

            broadcast.append(broadcastT, broadcastV);
            parent.insertBefore(broadcast, mid.nextSibling);
        }
        
        // Go to MyAnimeList
        let link = dataSet();
        
        let linkType = document.createElement("a");
        linkType.innerText = "Go to MyAnimeList";
        linkType.style.color = "rgb(var(--color-blue))";
        linkType.style.fontSize = "1.3rem";
        linkType.style.fontWeight = "500";
        linkType.style.paddingBottom = "5px";
        linkType.classList.add("almal");
        linkType.href = result.url;

        link.appendChild(linkType);

        // Insert in sidebar
        parent.insertBefore(score, parent.firstChild);
        parent.insertBefore(link, parent.firstChild);
        removeLoading();

        /*                   */
        /*     Overview      */
        /*                   */
        
        // Opening and ending themes
        if(contentType == "anime") {
            let grid = gridSectionWrap();
            let op = themesGrid("Opening themes", result.opening_themes);
            let ed = themesGrid("Ending themes", result.ending_themes);
            grid.append(op, ed);
            let overview = document.querySelector(".overview");
            overview.insertBefore(grid, overview.lastChild);
        }
    });
    
}

function initThings() {
    // if no anilist reviews, add link to mal reviews
    if(!Array.from(document.querySelectorAll('.link')).find(x => x.innerText == 'Reviews')) {
        let nav = document.querySelectorAll(".nav")[1];
        let linkEl = document.createElement("a");
        linkEl.classList.add("link", "almal");
        linkEl.style.padding = "15px";
        linkEl.style.color = "rgb(var(--color-text-lighter))";
        linkEl.href = `https://myanimelist.net/${contentType}/${currentId}/a/reviews`;
        linkEl.innerText = "Reviews (MAL)"
        nav.append(linkEl);
    }
    // Reviews tab
    if(window.location.pathname.endsWith("reviews")) {
        reviewThings();
    }
}

function reviewThings() {
    fetchReviews(currentId, contentType)
    .then(reviews => {

        let counter = 0;
        let interval = setInterval(function() {
            let container = document.querySelector(".media-reviews .review-wrap")

            counter++;
            if(container || counter > 5) {
                clearInterval(interval);
            }
            reviews.forEach(rev => {
                let content = rev.content.split(" ").splice(0, 15).join(" ")+"...";
                let rcard = reviewCard(rev.reviewer.image_url, content, rev.helpful_count, rev.url);
                container.appendChild(rcard);
            })
        }, 200) 
    })    
}

async function fetchThings(query, type, format) {
    let request = await fetch(`https://api.jikan.moe/v3/search/${type}?q=${encodeURIComponent(query)}&limit=5`);
    if(request.ok) {
        let data = await request.json();
        //const chances = match(query, data.results);
        //chances.ratings.sort((a,b) => b.rating-a.rating).find()

        const rule = rules.find(x => x.al == query);
        let id;

        if(rule) id = rule.mal;
        else {
            id = data.results.find(x => {
                if(x.type == "Novel" && format == "Light Novel") return 1
                else return x.type.toLowerCase() == format.toLowerCase()
            }).mal_id;
        }

        let areq = await fetch(`https://api.jikan.moe/v3/${type}/${id}`);
        if(areq.ok) {
            let anime = await areq.json();
            return anime;
        } else {
            console.error("Failed to fetch data from jikan.moe")
        }
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