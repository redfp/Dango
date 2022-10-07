const getCssVariable = (v) => getComputedStyle(document.body).getPropertyValue("--" + v);
const storage = window.localStorage;
const slides = document.getElementById("slides");
const slide_title = document.getElementById("slide-title");

var current_slide = 0;
var can_scroll = true;
var links;

loadLinks();
showSlides();
slides.addEventListener("wheel", changeSlidesByWheel);

function changeSlidesByWheel(event) {
    event.preventDefault();
    if (can_scroll) {
        if (event.deltaY > 0) {
            nextSlide();
        } else {
            previousSlide();
        }
        can_scroll = false;
        Promise.all(
            slides.getAnimations().map((animation) => animation.finished),
        ).then(() => { can_scroll = true; })
    }
}

function loadLinks() {
    let item = storage.getItem("links");
    if (item) {
        links = JSON.parse(item);
        generateLinks();
    }
    else {
        links = default_links;
        generateLinks();
    }
}

function generateLinks() {
    slides.innerHTML = "";
    links.forEach((slide) => {
        let res_div = document.createElement("div");
        res_div.classList.add("slide");
        let res_html = "";
        slide.content.forEach((link) => {
            res_html += `
            <a ${config.open_links_in_new_tab ? 'target="_blank" ' : ""}
               href="${link.link}"
               class="card">
                ${link.value}
            </a>`;
        });
        res_div.innerHTML = res_html;
        slides.append(res_div);
    });
}

function showSlides() {
    if (current_slide > links.length - 1) {
        current_slide = 0;
    }
    if (current_slide < 0) {
        current_slide = links.length - 1;
    }
    slide_title.innerHTML = links[current_slide].title;
    slides.style.transform = `translateY(
        calc(-${current_slide} * (var(--slide-cols) * var(--slide-col-height)
             + var(--slide-gap) * (var(--slide-cols) - 1) + var(--slide-padding) * 2)))`;
}

function nextSlide() {
    current_slide += 1;
    showSlides();
}

function previousSlide() {
    current_slide -= 1;
    showSlides();
}

function goToSlide(n) {
    current_slide = n;
    showSlides();
}