# MasterTech Computer Trading - CDO Website

A static promotional website for MasterTech Computer Trading - CDO. It includes a homepage with product highlights, customer reviews, branch information, store hours, and a separate products page with search, filters, pagination, and product detail modals.

## Files

- `index.html` - Homepage layout and sections.
- `products.html` - Products listing page.
- `styles.css` - Custom styling, responsive layout, animations, and modals.
- `script.js` - Sliders, mobile navigation, product filtering, pagination, modals, image previews, and store-hours status.
- `assets/` - Logo, hero banner, product images, laptop promos, and gaming chair promos.

## Features

- Responsive navbar with animated mobile/tablet burger menu.
- Hero section with CTA buttons and featured banner.
- Product sliders for desktop packages, laptops, and gaming chairs.
- Product detail modal shared between homepage product images and the products page.
- Products page with search, category filters, pagination, and smooth scroll on page changes.
- Customer review marquee and review cards.
- Trusted tech brands section.
- Branch cards with embedded Google Maps.
- Store hours status that updates based on the current time.
- Responsive layouts for desktop, tablet, and mobile.

## Running Locally

This is a static site, so you can open `index.html` directly in a browser.

For a local server, run one of these from the project folder:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## Pages

- Homepage: `index.html`
- Products page: `products.html`

## External Libraries

The site loads these from CDNs:

- Tailwind CSS
- Google Fonts: Inter
- AOS animations
- Lucide icons

An internet connection is needed for those CDN assets and embedded Google Maps to load.
