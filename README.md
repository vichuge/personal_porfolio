# Personal Portfolio

> My personal portfolio, designed as a Safari window on a macOS desktop — menu bar, Dock,
> a live Terminal, Launchpad-style stack and an "About This Mac" card.

**[Live site →](https://vichuge.github.io/personal_porfolio/)**

## Features

- macOS look and feel: translucent menu bar with live clock, Safari toolbar with working
  traffic lights (minimize to the Dock, zoom), Dock with magnification and notification banners
- Terminal window that types out my profile as a Node.js REPL session
- Project gallery with a segmented filter (front end / back end / others)
- Light and dark appearance (follows the OS, with a manual toggle in the menu bar)
- Accessible: semantic HTML, keyboard friendly, respects reduced motion and reduced transparency
- Fast: no frameworks, no build step, WebP images, ~zero JavaScript dependencies

## Built with

- HTML5, CSS3 (custom properties, `backdrop-filter`, `:has()`), vanilla JavaScript
- [Devicon](https://devicon.dev/) for technology icons

## Getting started

```sh
git clone https://github.com/vichuge/personal_porfolio.git
cd personal_porfolio
python3 -m http.server 8000   # then open http://localhost:8000
```

Any static server works. Deployment is GitHub Pages from `main`.

Contributing or using an AI agent? Read [AGENTS.md](AGENTS.md) first — it documents the design
system and conventions.

## Author

👤 **Victor Pacheco**

- GitHub: [@vichuge](https://github.com/vichuge)
- LinkedIn: [Victor Pacheco](https://www.linkedin.com/in/vpa12345/)
- X: [@VP90429](https://x.com/VP90429)

## 🤝 Contributing

Issues and suggestions are welcome on the [issues page](https://github.com/vichuge/personal_porfolio/issues).

## 📝 License

This project is licensed under [CC BY 3.0](LICENSE).
