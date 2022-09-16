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
        icon: true,
        value: "github",
      },
      {
        link: "https://gitlab.com/",
        icon: true,
        value: "gitlab",
      },
      {
        link: "https://trello.com/",
        icon: true,
        value: "trello",
      },
      {
        link: "https://drive.google.com/drive/u/0/my-drive",
        icon: true,
        value: "hard-drive",
      },
      {
        link: "https://stackoverflow.com/",
        icon: true,
        value: "layers",
      },
      {
        link: "https://en.wikipedia.org/wiki/Main_Page",
        icon: false,
        value: "W",
      },
    ],
  },
  {
    title: "Entertainment",
    content: [
      {
        link: "https://www.youtube.com/",
        icon: true,
        value: "youtube",
      },
      {
        link: "https://www.reddit.com/",
        icon: true,
        value: "home",
      },
      {
        link: "https://music.youtube.com/",
        icon: true,
        value: "play-circle",
      },
      {
        link: "https://www.netflix.com/browse",
        icon: false,
        value: "N",
      },
      {
        link: "https://www.twitch.tv/",
        icon: true,
        value: "twitch",
      },
      {
        link: "https://open.spotify.com",
        icon: false,
        value: "S",
      },
    ],
  },
];
