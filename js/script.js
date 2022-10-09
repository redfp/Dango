const clock_time = document.getElementById("time");
const clock_date = document.getElementById("date");
const search_form = document.getElementById("search-form");
const search_bar = document.getElementById("search-bar");

search_form.addEventListener("submit", search);
showTime();

function showTime() {
    var months = [
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

    var d = new Date();
    var h = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var M = d.getMonth();
    var D = d.getDate();
    var Y = d.getFullYear();

    var time = (h < 10 ? "0" + h : h) + ":" + (m < 10 ? "0" + m : m);

    if (config.show_seconds) {
        time += ":" + (s < 10 ? "0" + s : s);
    }

    if (config.am_pm) {
        var session = "AM";
        if (h == 0) {
            h = 12;
        }

        if (h > 12) {
            h = h - 12;
            session = "PM";
        }
        time += " " + session;
    }

    clock_time.textContent = time;

    if (config.month_first) {
        var date = months[M] + " " + D.toString();
    } else {
        var date = D.toString() + " " + months[M];
    }
    if (config.show_year) {
        date += ", " + Y;
    }

    clock_date.textContent = date;

    setTimeout(showTime, 1000);
}

function search(event) {
    if (search_bar.value) {
        event.preventDefault();
        const url = encodeURI(config.search_engine.replace("%s", search_bar.value));
        window.open(url, config.open_links_in_new_tab ? "_blank" : "_self");
        if (config.clear_searchbar) {
            search_bar.value = "";
        }
    }
}
