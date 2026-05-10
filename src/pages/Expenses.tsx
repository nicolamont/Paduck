import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react'
import AddExpenseModal from '../components/AddExpenseModal'
import ExportImport from '../components/ExportImport'
import type { Transazione, Categoria } from '../types'

interface ExpenseRowProps {
  t: Transazione
  cat: Categoria | undefined
  categorie: Categoria[]
  onDelete: (id: number) => void
}

function ExpenseRow({ t, cat, categorie, onDelete }: ExpenseRowProps) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    importo: String(t.importo),
    categoria_id: String(t.categoria_id),
    nota: t.nota,
    data: t.data.split('T')[0],
  })

  async function handleSave() {
    if (!form.importo || !form.categoria_id) return
    await db.transazioni.update(t.id!, {
      importo: parseFloat(form.importo),
      categoria_id: parseInt(form.categoria_id),
      nota: form.nota,
      data: new Date(form.data).toISOString(),
    })
    setEditing(false)
  }

  function handleCancel() {
    setForm({
      importo: String(t.importo),
      categoria_id: String(t.categoria_id),
      nota: t.nota,
      data: t.data.split('T')[0],
    })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="bg-slate-900 rounded-xl px-4 py-3 border border-indigo-500 space-y-3">
        <div className="flex gap-2">
          <input
            type="number"
            value={form.importo}
            onChange={e => setForm(f => ({ ...f, importo: e.target.value }))}
            placeholder="Importo (€)"
            className="w-28 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
          <select
            value={form.categoria_id}
            onChange={e => setForm(f => ({ ...f, categoria_id: e.target.value }))}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
            {categorie.map(c => (
              <option key={c.id} value={c.id}>{c.icona} {c.nome}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={form.nota}
            onChange={e => setForm(f => ({ ...f, nota: e.target.value }))}
            placeholder="Nota (opzionale)"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="date"
            value={form.data}
            onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!form.importo || !form.categoria_id}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check size={14} /> Salva
          </button>
          <button
            onClick={handleCancel}
            className="flex items-center gap-1 border border-slate-700 hover:border-slate-500 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition-colors"
          >
            <X size={14} /> Annulla
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between bg-slate-900 rounded-xl px-4 py-3 border border-slate-800">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{cat?.icona ?? '📦'}</span>
        <div>
          <p className="text-sm font-medium">{t.nota || cat?.nome}</p>
          <p className="text-xs text-slate-400">{new Date(t.data).toLocaleDateString('it')}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-semibold text-rose-400">- € {t.importo.toFixed(2)}</span>
        <button
          onClick={() => setEditing(true)}
          className="text-slate-500 hover:text-indigo-400 transition-colors"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(t.id!)}
          className="text-slate-500 hover:text-rose-400 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default function Expenses() {
  const [open, setOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  const transazioni = useLiveQuery(() =>
    db.transazioni.orderBy('data').reverse().toArray()
  )
  const categorie = useLiveQuery(() => db.categorie.toArray())

  if (!transazioni || !categorie) return null

  const catMap = Object.fromEntries(categorie.map(c => [c.id!, c]))

  const grouped = transazioni.reduce<Record<string, Transazione[]>>((acc, t) => {
    const d = new Date(t.data)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!acc[key]) acc[key] = []
    acc[key].push(t)
    return acc
  }, {})

  const mesiOrdinati = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  function labelMese(key: string) {
    const [year, month] = key.split('-')
    const d = new Date(parseInt(year), parseInt(month) - 1, 1)
    const label = d.toLocaleString('it', { month: 'long', year: 'numeric' })
    return label.charAt(0).toUpperCase() + label.slice(1)
  }

  function totMese(transazioni: Transazione[]) {
    return transazioni.reduce((s, t) => s + t.importo, 0)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Spese</h2>
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Plus size={16} /> Aggiungi
        </button>
      </div>

      <ExportImport />

      {transazioni.length === 0 && (
        <p className="text-slate-500 text-center py-12">Nessuna spesa ancora.</p>
      )}

      {mesiOrdinati.map(key => (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between py-2 border-b border-slate-800">
            <span className="text-sm font-semibold text-slate-300">{labelMese(key)}</span>
            <span className="text-sm text-rose-400 font-medium">- € {totMese(grouped[key]).toFixed(2)}</span>
          </div>
          {grouped[key].map(t => (
            <ExpenseRow
              key={t.id}
              t={t}
              cat={catMap[t.categoria_id]}
              categorie={categorie}
              onDelete={setDeleteConfirm}
            />
          ))}
        </div>
      ))}

      <AddExpenseModal open={open} onClose={() => setOpen(false)} categorie={categorie} />

      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-sm p-6 space-y-4">
            <h3 className="font-semibold text-lg">Elimina spesa</h3>
            <p className="text-slate-400 text-sm">
              Sei sicuro di voler eliminare questa spesa? L'operazione non è reversibile.
            </p>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await db.transazioni.delete(deleteConfirm)
                  setDeleteConfirm(null)
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Elimina
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-slate-700 hover:border-slate-500 text-slate-300 py-2 rounded-lg text-sm transition-colors"
              >
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}