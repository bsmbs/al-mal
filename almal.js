window.onclick = function(event) {
    if(event.target.nodeName == "A" || event.target.parentNode.nodeName == "A") {
        if(event.target.classList.contains("link")) return;
        
        doThings();
    }
}
setTimeout(doThings, 1000);

window.addEventListener("load", function() {
    alert("ss");
})

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
    let type = window.location.pathname.split("/")[1];
    fetchThings(title, type)
    .then(result => {
        console.dir(result)
        let parent = document.querySelector(".sidebar .data");

        let dataSet = document.createElement("div");
        dataSet.classList.add("data-set", "almal");
        dataSet.style.paddingBottom = "14px";

        let type = document.createElement("div");
        type.classList.add("type");
        type.innerText = "MAL Score";
        type.style.fontSize = "1.3rem";
        type.style.fontWeight = "500";
        type.style.paddingBottom = "5px";

        let value = document.createElement("div");
        value.classList.add("value");
        value.innerText = result.score;
        value.style.color = "rgb(var(--color-text-lighter))";
        value.style.fontSize = "1.2rem";
        value.style.lineHeight = "1.3";

        let link = document.createElement("div");
        link.classList.add("data-set", "almal");
        link.style.paddingBottom = "14px";

        let linkType = document.createElement("a");
        linkType.innerText = "Go to MyAnimeList";
        linkType.style.color = "rgb(var(--color-blue))";
        linkType.style.fontSize = "1.3rem";
        linkType.style.fontWeight = "500";
        linkType.style.paddingBottom = "5px";
        linkType.href = result.url;

        link.appendChild(linkType);

        dataSet.appendChild(type);
        dataSet.appendChild(value);

        parent.insertBefore(dataSet, parent.firstChild);
        parent.insertBefore(link, parent.firstChild);

    });
    document.querySelector(".sidebar .data")
}

async function fetchThings(query, type) {
    let request = await fetch(`https://api.jikan.moe/v3/search/${type}?q=${encodeURIComponent(query)}&limit=5`);
    if(request.ok) {
        let data = await request.json();
        const chances = match(query, data.results);
        return data.results[chances.index];
    } else {
        console.log("not")
    }
}

function match(query, results) {
    const res = findBestMatch(query, results.map(x => x.title));
    return { index: res.bestMatchIndex, rating: res.bestMatch.rating}
}