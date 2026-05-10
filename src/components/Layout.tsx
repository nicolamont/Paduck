import { LayoutDashboard, List, Tag } from 'lucide-react'

type Page = 'dashboard' | 'expenses' | 'categories'

interface Props {
  children: React.ReactNode
  page: Page
  setPage: (page: Page) => void
}

const nav: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { id: 'expenses',   label: 'Spese',       icon: List },
  { id: 'categories', label: 'Categorie',   icon: Tag },
]

export default function Layout({ children, page, setPage }: Props) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <header className="border-b border-slate-800 px-6 py-4">
        <img src="/icon-192.png" alt="Spese" className="h-8 w-8 object-contain" />
      </header>

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        {children}
      </main>

      <nav className="border-t border-slate-800 flex justify-around py-3 sticky bottom-0 bg-slate-950">
        {nav.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setPage(id)}
            className={`flex flex-col items-center gap-1 text-xs px-4 py-1 rounded-lg transition-colors
              ${page === id ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
          >
            <Icon size={20} />
            {label}
          </button>
        ))}
      </nav>
    </div>
  )
}