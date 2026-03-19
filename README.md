# Restaurante D'Charly — Menú Digital

Mexican Taste & Tradition

## Quick Start

```bash
npm install
npm run dev        # Start dev server
npm run build      # Production build → dist/
npm run preview    # Preview production build
```

## Editing the Menu

Edit `src/data/menu.json` to add, remove, or modify items. Each item has:

```json
{
  "name": "Item Name",
  "description": "Short description",
  "price": 100,
  "featured": false,
  "tags": ["Optional tag"],
  "image": "/charly-menu/images/menu/filename.jpg"
}
```

## Adding Photos

1. Place images in `public/images/menu/`
2. Add the `image` field to the item in `menu.json`:
   ```json
   "image": "/charly-menu/images/menu/your-photo.jpg"
   ```

## QR Code

```bash
npm run generate-qr
```

Generated files appear in `public/qr/`. Print `menu-qr.png` for table cards.

## Deployment

Push to `main` branch → GitHub Actions auto-deploys to:
**https://cdcalderon.github.io/charly-menu/**
