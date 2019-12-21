function dataSet() {
    let el = document.createElement("div");
    el.classList.add("data-set", "almal");
    el.style.paddingBottom = "14px";

    return el;
}

function tElement(content) {
    let el = document.createElement("div");
    el.classList.add("type");
    el.innerText = content;
    el.style.fontSize = "1.3rem";
    el.style.fontWeight = "500";
    el.style.paddingBottom = "5px";

    return el;
}

function vElement(content) {
    let el = document.createElement("div");
    el.classList.add("value");
    el.innerText = content;
    el.style.color = "rgb(var(--color-text-lighter))";
    el.style.fontSize = "1.2rem";
    el.style.lineHeight = "1.3";

    return el;
}

function reviewCard(av, content, likes, href) {
    let card = document.createElement("div");
    card.classList.add("review-card", "review", "almal");
    card.style.marginBottom = "20px";
    card.style.display = "grid";
    card.style.gridTemplateColumns = "50px auto";

    let user = document.createElement("a");
    user.classList.add("user", "almal");
    user.setAttribute("data-src", av);
    user.setAttribute("data-v-24561a98", "");
    user.setAttribute("lazy", "loaded");
    user.style.backgroundImage = "url('"+av+"')";

    let contentEl = document.createElement("a");
    contentEl.classList.add("content", "almal");
    contentEl.href = href;
    contentEl.setAttribute("data-v-24561a98", "");

    let summary = document.createElement("div");
    summary.setAttribute("data-v-24561a98", "");
    summary.classList.add("summary", "almal");
    summary.innerText = content;

    let tooltip = document.createElement("div");
    tooltip.classList.add("el-tooltip", "votes");
    tooltip.setAttribute("data-v-24561a98", "");
    tooltip.innerHTML = `<svg data-v-24561a98="" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="thumbs-up" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline--fa fa-thumbs-up fa-w-16 fa-sm"><path data-v-24561a98="" fill="currentColor" d="M104 224H24c-13.255 0-24 10.745-24 24v240c0 13.255 10.745 24 24 24h80c13.255 0 24-10.745 24-24V248c0-13.255-10.745-24-24-24zM64 472c-13.255 0-24-10.745-24-24s10.745-24 24-24 24 10.745 24 24-10.745 24-24 24zM384 81.452c0 42.416-25.97 66.208-33.277 94.548h101.723c33.397 0 59.397 27.746 59.553 58.098.084 17.938-7.546 37.249-19.439 49.197l-.11.11c9.836 23.337 8.237 56.037-9.308 79.469 8.681 25.895-.069 57.704-16.382 74.757 4.298 17.598 2.244 32.575-6.148 44.632C440.202 511.587 389.616 512 346.839 512l-2.845-.001c-48.287-.017-87.806-17.598-119.56-31.725-15.957-7.099-36.821-15.887-52.651-16.178-6.54-.12-11.783-5.457-11.783-11.998v-213.77c0-3.2 1.282-6.271 3.558-8.521 39.614-39.144 56.648-80.587 89.117-113.111 14.804-14.832 20.188-37.236 25.393-58.902C282.515 39.293 291.817 0 312 0c24 0 72 8 72 81.452z" class=""></path></svg> ${likes}`;

    contentEl.append(summary, tooltip);
    card.append(user, contentEl);

    return card;
}

function gridSectionWrap() {
    let el = document.createElement("div");
    el.classList.add("grid-section-wrap", "almal");
    el.setAttribute("data-v-72ecf676", "");
    return el;
}

function themesGrid(title, th) {
    let el = document.createElement("div");
    el.classList.add("almal");

    let link = document.createElement("h2");
    link.classList.add("link", "almal");
    link.innerText = title;

    let content = document.createElement("div");
    content.classList.add("follow", "almal");
    content.style.background = "rgb(var(--color-foreground))";
    content.style.padding = "12px";
    content.style.fontSize = "1.2rem";
    
    th.forEach((theme, i) => {
        let themeEl = document.createElement("div");
        themeEl.style.padding = "4px";
        themeEl.innerText = `#${i+1}: ${theme}`;

        content.append(themeEl);
    })

    el.append(link, content);
    return el;
}

function loading() {
    let loadingEl = document.createElement("div");
    loadingEl.innerText = "Loading...";
    loadingEl.classList.add("almal-loading")

    let parent = document.querySelector(".sidebar .data");
    document.querySelector(".sidebar").insertBefore(loadingEl, parent);
}

function removeLoading() {
    let loadingEl = document.querySelector(".almal-loading");
    loadingEl.remove()
}