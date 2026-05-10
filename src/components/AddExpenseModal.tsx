import { useState } from 'react'
import { db } from '../db/database'
import { X } from 'lucide-react'
import type { Categoria } from '../types'

interface Props {
  open: boolean
  onClose: () => void
  categorie: Categoria[]
}

interface FormState {
  importo: string
  categoria_id: string
  nota: string
  data: string
}

export default function AddExpenseModal({ open, onClose, categorie }: Props) {
  const [form, setForm] = useState<FormState>({
    importo: '',
    categoria_id: '',
    nota: '',
    data: new Date().toISOString().split('T')[0],
  })

  if (!open) return null

  async function handleSubmit() {
    if (!form.importo || !form.categoria_id) return
    await db.transazioni.add({
      importo: parseFloat(form.importo),
      categoria_id: parseInt(form.categoria_id),
      nota: form.nota,
      data: new Date(form.data).toISOString(),
    })
    setForm({
      importo: '',
      categoria_id: '',
      nota: '',
      data: new Date().toISOString().split('T')[0],
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Nuova spesa</h3>
          <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
        </div>

        <input
          type="number"
          placeholder="Importo (€)"
          value={form.importo}
          onChange={e => setForm(f => ({ ...f, importo: e.target.value }))}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />

        <select
          value={form.categoria_id}
          onChange={e => setForm(f => ({ ...f, categoria_id: e.target.value }))}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
        >
          <option value="">Seleziona categoria</option>
          {categorie.map(c => (
            <option key={c.id} value={c.id}>{c.icona} {c.nome}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Nota (opzionale)"
          value={form.nota}
          onChange={e => setForm(f => ({ ...f, nota: e.target.value }))}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />

        <input
          type="date"
          value={form.data}
          onChange={e => setForm(f => ({ ...f, data: e.target.value }))}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
        />

        <button
          onClick={handleSubmit}
          disabled={!form.importo || !form.categoria_id}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Aggiungi spesa
        </button>
      </div>
    </div>
  )
}