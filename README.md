# Dango
![](https://user-images.githubusercontent.com/50246819/128202000-93d2e294-ceb9-42bf-abe9-6b0168060836.png)

Minimal and simple HTML startpage created for personal use, inspired by [Bento](https://github.com/migueravila/Bento).


### Goals

- Lightweight but modern
- Configurable
- Vanilla HTML / JS / CSS
- Responsive design

### Usage

These tiles with icons on the main page are called _links_. All _links_ are contained inside _slides_.

Every _link_ can have either an icon, taken from [Feather Icons](https://feathericons.com/), or some text. The text one is useful for things that don't have a suitable icon. You can customise _links_ at `js/links.js`.

Every _slide_ has a title, and can hold as many _links_ as you want. The thing is, if the number of _links_ in a _slide_ exceeds viewable limit (6 links per slide by default), everything will be out of its place. Maybe it will be fixed in future versions. You can change the amount of links one slide can hold in the `css/style.css`, in `:root` section.

In any case, you are free to edit any file you want. Beginner-friendliness is on the to-do list, but not something this startpage has right now. Again, it was created mostly for personal use (and as a training in web development).