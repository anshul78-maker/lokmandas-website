# Deploying the Dr. Lokmandas website (GitHub → live site → Wix)

## First, an important point about Wix
Wix **cannot import or host a hand-coded HTML/CSS/JS website**, not even from GitHub.
Wix's "GitHub integration" only syncs *Velo* code (small JavaScript files) for a site that
was **built inside the Wix editor**. It can't take these `.html` pages.

So the working route is:

1. **GitHub Pages** hosts this website for free, straight from your GitHub repo.
2. **Wix** then either points your domain at it (best) or shows it inside a Wix page.

---

## Step 1: Turn on GitHub Pages (about 2 minutes)

The website has its own repository, <https://github.com/anshul78-maker/lokmandas-website>
(branch `main`, with `index.html` at the top level). It is completely separate from the ERP.

1. Open <https://github.com/anshul78-maker/lokmandas-website> and sign in.
2. Click **Settings** (top bar), then **Pages** (left menu).
3. Under **Build and deployment** set:
   - **Source:** *Deploy from a branch*
   - **Branch:** `main`, folder `/ (root)`, then click **Save**.
4. Wait 1–3 minutes and refresh the page. GitHub shows
   **"Your site is live at https://anshul78-maker.github.io/lokmandas-website/"**.
5. Open that link and check every page.

---

## Step 2: Connect it to Wix (pick ONE option)

### Option A (recommended): use your Wix domain for this site
Visitors type your domain (for example `www.drlokmandasschool.com`) and see this website.
SEO, phone layout and speed all work properly.

**On GitHub**
1. **Settings → Pages → Custom domain:** type `www.yourdomain.com`, then click **Save**.
2. Once the DNS check passes (Step 3 below), tick **Enforce HTTPS**.

**On Wix** (domain bought on Wix)
1. Go to **wix.com → your account → Domains**, then click your domain.
2. Click **Manage DNS Records** (under *Advanced*).
3. **CNAME record:** Host `www` → Value `anshul78-maker.github.io`
   (edit the existing `www` CNAME if there is one).
4. **A records** for the root (`@` / blank host). Replace Wix's A records with these four:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```
5. Click **Save**. DNS changes take from 30 minutes up to 24–48 hours.

> Note: after this, the domain shows the GitHub site, **not** any Wix-built site on it.
> If Wix warns that the domain will be disconnected from your Wix site, that is expected.

### Option B: show the website inside a Wix page (no DNS changes)
1. Open your site in the **Wix Editor**.
2. Click **Add (+) → Embed Code → Embed a site**.
3. Click **Enter Website Address** and paste `https://anshul78-maker.github.io/lokmandas-website/`.
4. Drag the box to full width (**Stretch**) and make it as tall as the page.
5. Remove the Wix header/footer on that page so you don't get two menus, then **Publish**.

Downsides of Option B: Google indexes the Wix page and not your content, phones may
scroll inside the frame, and some links open inside the frame. Use Option A if you can.

---

## Step 3: Updating the website later
Easiest: on GitHub open the repo, click a file, then the pencil icon. Edit it and click
**Commit changes**. To add photos, use **Add file → Upload files** inside `img/`.

Or from a PC with the repo cloned:
```
git clone https://github.com/anshul78-maker/lokmandas-website.git
cd lokmandas-website
# edit files, then:
git add .
git commit -m "Update website"
git push
```
GitHub Pages redeploys automatically in about a minute, and a Wix embed shows the change
without republishing in Wix.

---

## The enquiry form
GitHub Pages only serves files, so `POST /api/enquiry` has nowhere to go. The form then
shows its built-in fallback: "please call 7520911618 or email …". To receive enquiries,
either run `server-example.js` (or your ERP backend) on a server and change
`API_ENQUIRY` in `script.js` to its full URL, or use a form service such as Formspree.
