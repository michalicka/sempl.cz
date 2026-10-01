# sempl.cz – static website

Plain HTML/CSS with a tiny optional JS file. There is no PHP, no database, no CMS, no cookies and no third-party requests.

## Deploy (Coolify)

1. Create a **Docker Compose** application in Coolify and connect this repository.
2. Set the Compose file to `/compose.yaml`.
3. In the `website` service, set the domain to `https://www.sempl.cz` (port 80 is used automatically).
4. Add `https://sempl.cz` too if Coolify should redirect the bare domain to `www`, then select **Redirect to www** in its domain settings.
5. Deploy. The Compose health check verifies the nginx server through `/health`.

The service uses only `expose: 80`; it deliberately does not publish a host port, because Coolify's proxy reaches it over the internal Docker network. TLS and the canonical `www` redirect are managed in Coolify.

For a local smoke test, temporarily add `ports: ["8080:80"]` to the `website` service and open `http://localhost:8080`.

## Deploy (FTP)
1. Back up the current WordPress files and database, then delete them from the web root (`wp-*`, `index.php`, `xmlrpc.php`, …).
2. Upload the **contents** of `public/` to the web root. Include the hidden `.htaccess`, since some FTP clients hide dotfiles.
3. Check that https://www.sempl.cz/ and /cookies/ load, and that /kontakt/ redirects.

## Redirects
- `/kontakt/` → `/#kontakt`
  - On **Apache**, `.htaccess` sends a real 301 and also adds the security headers and caching.
  - On **pure nginx**, `.htaccess` is ignored, and `kontakt/index.html` redirects with a meta refresh and a canonical link. If you have access to the nginx config, add this:

```nginx
location = /kontakt  { return 301 /#kontakt; }
location = /kontakt/ { return 301 /#kontakt; }
location ~ ^/(wp-admin|wp-content|wp-includes|wp-json)(/|$) { return 410; }
location ~ ^/(wp-login|xmlrpc|wp-cron)\.php$ { return 410; }
error_page 404 /404.html;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests" always;
```

## Cookies page
`/cookies/` is a standalone white page (`public/cookies/index.html`, styled by `assets/css/legal.css`) with the original cookie policy text. Other company websites link to it. On purpose, it has no navigation and the homepage doesn't link to it, because this site doesn't use cookies.

## Illustrations
These files in `public/assets/img/` are used as CSS backgrounds. To swap one, replace the file under the same name and bump `?v=` in the HTML files.
- `hero.webp`: the hero picture
- `project-nlp.webp`, `project-elingo.webp`: the project card backgrounds

## Editing
- Text: `public/index.html`
- Styles: `public/assets/css/style.css`. The colours are defined at the top in `:root`.
- After changing CSS or JS, bump `?v=1` in `index.html` so browsers fetch the new file.
- Social preview image: `public/assets/img/og-image.png` (1200×630)
