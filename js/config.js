var config = {
    show_seconds: false,
    am_pm: false,
    show_year: false,
    month_first: true,
    open_links_in_new_tab: true,
    search_engine: "https://www.google.com/search?q=%s",
    clear_searchbar: true,
    force_x_button: true,
    auto_save: true,
};

const default_links = [
    {
        title: "General",
        content: [
            {
                link: "https://github.com/",
                value: "",
            },
            {
                link: "https://gitlab.com/",
                value: "",
            },
            {
                link: "https://trello.com/",
                value: "",
            },
            {
                link: "https://drive.google.com/drive/u/0/my-drive",
                value: "",
            },
            {
                link: "https://stackoverflow.com/",
                value: "",
            },
            {
                link: "https://en.wikipedia.org/wiki/Main_Page",
                value: "",
            },
        ],
    },
    {
        title: "Entertainment",
        content: [
            {
                link: "https://www.youtube.com/",
                value: "",
            },
            {
                link: "https://www.reddit.com/",
                value: "",
            },
            {
                link: "https://music.youtube.com/",
                value: "",
            },
            {
                link: "https://www.netflix.com/browse",
                value: "ﱄ",
            },
            {
                link: "https://www.twitch.tv/",
                value: "",
            },
            {
                link: "https://open.spotify.com",
                value: "",
            },
        ],
    },
];
