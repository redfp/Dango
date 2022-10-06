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
    event.preventDefault();
    const q = document.getElementsByClassName("search_bar")[0];
    const url = encodeURI(config.search_engine.replace("%s", q.value));
    window.open(url, config.open_links_in_new_tab ? "_blank" : "_self");
    if (config.clear_searchbar) {
        q.value = "";
    }
}

document.getElementById("search").addEventListener("submit", search);
showTime();
