function showTime() {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    let d = new Date();
    let h = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    let M = d.getMonth();
    let D = d.getDate();
    let Y = d.getFullYear();

    let time = (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);

    if (config.show_seconds) {
        time += ":" + (s < 10 ? "0" + s : s);
    }

    if (config.am_pm) {
        let session = "AM";
        if (h == 0) {
            h = 12;
        }

        if (h > 12) {
            h = h - 12;
            session = "PM";
        }
        time += " " + session;
    }

    document.getElementsByClassName("time").item(0).textContent = time;

    if (config.month_first) {
        var date = months[M] + " " + D.toString();
    } else {
        var date = D.toString() + " " + months[M];
    }
    if (config.show_year) {
        date += ", " + Y;
    }

    document.getElementsByClassName("date").item(0).textContent = date;

    setTimeout(showTime, 1000);
}

function search(event) {
    const q = document.getElementsByClassName("search_bar")[0];
    event.preventDefault();
    const url = encodeURI(config.search_engine.replace("%s", q.value));
    window.open(url, config.open_links_in_new_tab ? "_blank" : "_self");
    if (config.clear_searchbar) {
        q.value = "";
    }
}

currentSlide = 0;

function nextSlide() {
    currentSlide += 1;
    showSlides();
}

function previousSlide() {
    currentSlide -= 1;
    showSlides();
}

function showSlides() {
    const slides = document.getElementsByClassName("slide");
    const links_slides = document.getElementsByClassName("slides")[0];
    if (currentSlide > slides.length - 1) {
        currentSlide = 0;
    }
    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    document.getElementsByClassName("title")[0].innerHTML =
        links[currentSlide].title;
    links_slides.style.transform = `translateY(calc(-${currentSlide} * (var(--slide-cols) * var(--slide-col-height) + var(--slide-gap) * (var(--slide-cols) - 1) + var(--slide-padding) * 2)))`;
}

function changeSlidesByWheel(event) {
    event.preventDefault();
    if (event.deltaY > 0) {
        nextSlide();
    } else {
        previousSlide();
    }
}

function setStyleVariable(variable, value) {
    document.querySelector(":root").style.setProperty(variable, value);
}

function generateLinks() {
    links.forEach((slide) => {
        let res_div = document.createElement("div");
        res_div.classList.add("slide");
        let res_html = "";
        slide.content.forEach((link) => {
            res_html += `
        <a ${config.open_links_in_new_tab ? 'target="_blank" ' : ""}href="${link.link
                }" class="card">
          ${link.value}
        </a>`;
        });
        res_div.innerHTML = res_html;
        document.getElementsByClassName("slides")[0].append(res_div);
    });
}

document.getElementById("search").addEventListener("submit", search);
document
    .getElementsByClassName("slides")[0]
    .addEventListener("wheel", changeSlidesByWheel);

var links = default_links;

generateLinks();
showTime();
showSlides();
feather.replace();
