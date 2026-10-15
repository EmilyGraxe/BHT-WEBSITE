# BHT Juice website

Plain HTML, CSS and JavaScript. No build step, no frameworks.

## Run locally
Open `index.html` in a browser, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Structure
- `index.html` page markup and SEO metadata
- `css/style.css` design tokens, layout, animation, responsive rules
- `js/script.js` settings (`CONFIG`), products (`PRODUCTS`), carousel, filters, order drawer, form validation
- `assets/images/` your photographs

## Photographs (important)
The code references real photo files in `assets/images/`. Until you add them, a branded illustration appears automatically.
Download licensed photos (e.g. from Unsplash or Pexels, checking each licence) and save them with these names:
`golden-mango.jpg, sunrise-orange.jpg, tropical-pineapple.jpg, watermelon-splash.jpg, passion-burst.jpg, green-garden.jpg, fresh-fruit.jpg, promo-juice-pour.jpg, hero-juices.jpg` (the last is used for social sharing).
Landscape 1600px wide, under 300 KB each, works well. To change a product's photo or alt text, edit its `img` / `alt` in `PRODUCTS`.

## Edit products and prices
In `js/script.js`, edit the `PRODUCTS` array (name, description, `price`, category `cat`, `featured: true` to show in the slider).
Prices are **sample placeholders**. Set `pricesArePlaceholders: false` in `CONFIG` once they are real.

## WhatsApp ordering
Set `whatsappNumber` in `CONFIG` (digits with country code, e.g. `256700000000`). The button then opens WhatsApp with a prepared message.
This only prepares a message. There is no payment, stock control or automatic order confirmation.

## Business details
Fill `phone`, `email`, `location`, `hours` and `social` in `CONFIG`. Empty values show a visible placeholder.

## Needs a backend or service
- **Contact form:** validates in the browser only. Set `formEndpoint` to a form service (Formspree, Getform, your own API) to deliver messages. Until then it tells the visitor nothing was sent.
- **Payments, stock, order storage:** not implemented.
- **Testimonials:** placeholders. Replace with genuine feedback.

## Deploy
Upload the whole folder to any static host (Netlify, Vercel, GitHub Pages, cPanel). Update the `og:image` path and add your domain's absolute URL for social previews.
