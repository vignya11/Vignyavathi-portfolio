# Racharla Vignyavathi — Portfolio

A premium, animated personal portfolio built with plain **HTML, CSS, and JavaScript** — no frameworks, no build step.

## Run it

1. Open this folder in VS Code.
2. Install the **Live Server** extension (if you don't have it).
3. Right-click `index.html` → **Open with Live Server**.

That's it — no `npm install`, no build tools.

## What's already filled in

- **Profile photo** — `assets/profile.jpg` (your real headshot)
- **Resume** — `assets/resume.pdf` (your real resume)
- **Certificates** — `assets/certificates/certificate-1.jpg` (Gen-AI Camp, AlgoUniversity) and `certificate-2.jpg` (AWS Solutions Architecture Job Simulation, Forage)
- **All text content** — About, Skills, Projects, Achievements, and Contact sections are filled in from your resume (education, Foxconn experience, technical skills, Insta Spam Detection, Driver Drowsiness Detection, Smart Inventory Management System, AICTE Idea Lab, Robotics club)

## Add more later

| What | Where |
|---|---|
| More certificates | Drop new images into `assets/certificates/`, then duplicate a `<button class="cert-card">...</button>` block in the Certificates section of `index.html` |
| Project screenshots | Replace `assets/projects/project-1.jpg`, `project-2.jpg`, `project-3.jpg` with real screenshots (same filenames) |
| Live demo / GitHub links | Update the `href` values in the Projects section — currently point to your GitHub profile since individual repo links weren't provided |
| Any text | Edit directly inside `index.html` |

## Structure

```
portfolio/
├── index.html      (all markup & content)
├── style.css        (design system + all styling/animations)
├── script.js        (all interactivity — loader, theme, cursor, reveals, form, etc.)
├── assets/
│   ├── profile.jpg
│   ├── resume.pdf
│   ├── projects/
│   ├── certificates/
│   └── icons/
└── README.md
```

## Features

- Loading screen, page reveal, scroll progress bar, back-to-top
- Custom cursor with glow trail (disabled automatically on touch devices)
- Canvas-based floating particle background
- Glassmorphism cards throughout (About, Skills, Timeline, Contact, Resume)
- Animated hero: rotating gradient ring, glowing/floating profile photo, 3D mouse-tilt, typing effect
- Scroll-triggered reveal animations via `IntersectionObserver` (fade/slide/scale — no external libraries)
- Animated, ripple-enabled buttons
- Project & certificate cards with hover-lift and image zoom; certificate lightbox popup
- Client-side validated contact form with inline errors and a success message (no backend wired up — hook up your own email/API service in `initContactForm()` inside `script.js`)
- Dark/light theme toggle, persisted with `localStorage`
- Fully responsive: mobile, tablet, laptop, desktop, ultra-wide
- Respects `prefers-reduced-motion`; keyboard-navigable; visible focus states; semantic HTML with ARIA labels

## Notes

- The contact form does **not** send email by default — it only validates and shows a success state in the UI. Wire it to a backend, [Formspree](https://formspree.io/), EmailJS, or similar for real delivery.
