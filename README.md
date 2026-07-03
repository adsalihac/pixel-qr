# PixelQR

PixelQR is an Expo + React Native (web/mobile) QR generator focused on branded, scan-safe QR design.

## Product Features

- Real-time QR preview while editing payload and styling.
- Payload builders for `url`, `text`, `email`, `phone`, `whatsapp`, `wifi`, `vcard`, `upi`, and `deeplink` formats.
- Deep visual customization: dot/eye styles, inner and outer eye colors, gradients, sizing, padding, frames, and transparent backgrounds.
- Logo upload with sizing controls designed to protect QR readability.
- Scan Safety scoring with warnings for contrast, logo coverage, and quiet zone issues.
- 16 built-in templates (business, restaurant, social, payments, events, app downloads, maps, coupons, reviews, and more).
- Export actions for PNG and SVG, plus copy/share payload workflows.
- Responsive generator layout optimized for desktop and mobile web.

## Tech Stack

- Expo 57
- React 19 + React Native 0.86
- Expo Router
- Zustand
- React Hook Form + Zod

## Getting Started

Use `pnpm` in this repository:

```bash
pnpm install
pnpm start
```

Web-only dev server:

```bash
pnpm web
```

## Scripts

- `pnpm start` - Start Expo dev server.
- `pnpm web` - Start web target.
- `pnpm ios` - Launch iOS target.
- `pnpm android` - Launch Android target.
- `pnpm build:web` - Export web build.
- `pnpm typecheck` - Run TypeScript checks.

## Contributing

1. Fork the repository.
2. Create a feature branch from `main`.
3. Install dependencies with `pnpm install`.
4. Make your changes and run checks:

	```bash
	pnpm typecheck
	```

5. Test the relevant app target (`pnpm web`, `pnpm ios`, or `pnpm android`).
6. Commit with a clear message.
7. Push your branch and open a Pull Request with a concise summary, screenshots for UI changes, and testing notes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
