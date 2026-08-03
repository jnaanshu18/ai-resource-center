# Shared site chrome (swappable)

This folder is a **temporary stand-in** for Daily Code Solutions site header / branding.

When you plug this page into the real company website, replace this entire folder (or just stop loading these files) with the existing site header component.

## Files

| File | Purpose |
|------|---------|
| `header.js` | Renders the DCS header into `#dcs-site-header` |
| `header.css` | Styles for that header only |
| `assets/logo.svg` | Wordmark for white backgrounds |
| `assets/logo.png` | Raster fallback |
| `assets/favicon.jpg` | Favicon |

## How `index.html` mounts it

```html
<!-- BEGIN: DCS site chrome (docs/shared/) — replace with company header -->
<link rel="stylesheet" href="shared/header.css">
<div id="dcs-site-header"></div>
<script src="shared/header.js"></script>
<!-- END: DCS site chrome -->
```

## Swap checklist

1. Remove the three lines above from `docs/index.html`.
2. Drop in the company header markup / component in the same place.
3. Delete or ignore `docs/shared/` (and optionally the local `Daily Code Solutions Logo/` source folder).
4. Keep the page toolbar (Suggest a tool) — that stays with this app.
