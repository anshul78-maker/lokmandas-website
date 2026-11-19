# Dr. Lokmandas Public School — website

Static marketing website (no build step). Plain HTML, CSS and JavaScript.

## Files
- `index.html` — page markup; links `styles.css` and `script.js`.
- `styles.css` — all styling. Theme tokens are at the top in `:root` (change the
  `--gold` / `--navy` variables to retheme the whole site).
- `script.js` — all behaviour: hero slideshow, toppers slideshow, tabs, popup,
  stat counters, and the admission enquiry form.
- `img/` — every photo (campus, leadership, programmes, and `img/toppers/` for
  the CBSE 2025–26 toppers).
- `server-example.js` — optional minimal Express backend (static hosting +
  enquiry endpoint). Not required to view the site.

## Run as a static site
Open `index.html` in a browser, or serve the folder with anything, e.g.
`python -m http.server` or `npx serve`.

## Add a backend
The only dynamic part is the **admission enquiry form**. In `script.js` it POSTs
JSON to the endpoint in `API_ENQUIRY` (default `/api/enquiry`):

```json
{ "name": "...", "phone": "...", "email": "...", "grade": "...", "message": "...", "submittedAt": "ISO-8601" }
```

Your endpoint should reply with a 2xx status (optionally `{ "ok": true }`).
On failure the form shows a fallback with the school phone and email.

A working reference is in `server-example.js`:

```bash
npm install express
node server-example.js    # http://localhost:3000
```

Replace its "append to enquiries.jsonl" step with an insert into your database
(your ERP already uses SQLite) and/or an email via nodemailer.

## Notes
- The **ERP Login / Pay Fees / Transfer Certificate / Results** links point to the
  existing ERP at `lockmandas-school-erp-web.vercel.app/login` — change these in
  `index.html` if your ERP moves.
- Social links (YouTube, Facebook, Instagram) are in the footer and the mobile menu.
- Footer credit: "Powered by Edumaxim" links to https://www.edumaxim.com/.
- Real content included: toppers (names, marks, photos), address
  (Chandpur, Aliganj Road, Etah), phones (7520911618, 9897541157),
  email, and CBSE affiliation No. 2131433.

## Deploying with Wix
Wix does **not** let you upload a hand-coded HTML/CSS/JS site, so you can't import this
folder as a Wix site. You have two options:

1. **Recommended: host these files as-is and use your domain.** Upload the whole folder to
   a free static host (Netlify "drag & drop", Vercel, GitHub Pages, or Cloudflare Pages), then
   point your domain to it. If the domain was bought through Wix, you can keep it there and
   just change its DNS records (Wix > Domains > Manage DNS) to the host's values.
2. **Embed it inside a Wix page.** Host the files as in option 1, then in the Wix editor add
   *Embed Code > Embed a site* and paste the hosted URL, stretched to full width. This works,
   but search engines see the Wix page and not the content inside, and the frame can scroll
   awkwardly on phones.

Either way, a static host can't run `POST /api/enquiry`. Run `server-example.js` (or your
ERP backend) somewhere, or swap the form for a form service.
