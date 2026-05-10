# Paduck

> A clean, offline-first personal expense tracker — installable as a PWA.

**[Live Demo](https://your-url.vercel.app)** · **[Report a Bug](https://github.com/yourusername/paduck/issues)** · **[Request a Feature](https://github.com/yourusername/paduck/issues)**

---

## Screenshots

> _Add screenshots here once the app is deployed_

---

## Features

- 📊 **Monthly dashboard** — total spent, average expense, top category, breakdown by category with progress bars
- 💸 **Expense tracking** — add, edit, and delete expenses with category, note, and date
- 🗂️ **Custom categories** — create, edit, and delete categories with custom emoji and color
- 📅 **Month navigation** — browse past months on the dashboard
- 📤 **Export / Import** — back up and restore all your data as a JSON file
- 📱 **PWA** — installable on Android, iOS, and desktop, works fully offline
- 🌙 **Dark mode** — easy on the eyes

---

## Tech Stack

| Role           | Technology           |
| -------------- | -------------------- |
| Framework      | React 19 + Vite      |
| Language       | TypeScript           |
| Styling        | Tailwind CSS         |
| Local database | Dexie.js (IndexedDB) |
| Icons          | Lucide React         |
| PWA            | Vite PWA Plugin      |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/paduck.git
cd paduck

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npx serve dist
```

---

## PWA Installation

Once deployed, open the app in your browser:

- **Android (Chrome)** — tap the banner "Add to Home Screen" or use the three-dot menu
- **iPhone (Safari)** — tap the share icon → "Add to Home Screen"
- **Desktop (Chrome/Edge)** — click the install icon in the address bar

---

## Data & Privacy

All data is stored **locally in your browser** using IndexedDB. Nothing is sent to any server. You own your data entirely.

You can export a full backup as a JSON file at any time from the Expenses page, and import it on any other device.

---

## Roadmap

- [ ] Charts and graphs (waiting for Tremor React 19 support)
- [ ] Google Drive backup sync
- [ ] Budget limits per category
- [ ] CSV export

---

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🇮🇹 Italiano

**Paduck** è un'app per tracciare le spese personali, pensata per essere semplice, veloce e completamente offline. Tutti i dati rimangono sul tuo dispositivo — nessun account, nessun server, nessuna pubblicità.

### Funzionalità principali

- Aggiungi e modifica spese con categoria, nota e data
- Crea categorie personalizzate con emoji e colore
- Dashboard mensile con riepilogo e breakdown per categoria
- Naviga tra i mesi passati
- Esporta e importa i dati come file JSON
- Installabile come app su Android, iOS e desktop

### Installazione locale

```bash
git clone https://github.com/yourusername/paduck.git
cd paduck
npm install
npm run dev
```

### Dati e privacy

Tutti i dati sono salvati localmente nel browser tramite IndexedDB. Nulla viene inviato a server esterni. Puoi esportare un backup completo in formato JSON in qualsiasi momento.
