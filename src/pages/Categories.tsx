import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'
import { Plus, Trash2, Pencil, Check} from 'lucide-react'
import type { Categoria } from '../types'

const COLORI = ['#f97316','#3b82f6','#a855f7','#22c55e','#eab308','#ec4899','#6b7280','#ef4444','#14b8a6']

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  const [mode, setMode] = useState<'preset' | 'custom'>('preset')

  return (
    <div className="space-y-2">
      {/* Toggle preset / custom */}
      <div className="flex gap-2">
        <button
          onClick={() => setMode('preset')}
          className={`text-xs px-3 py-1 rounded-lg transition-colors ${mode === 'preset' ? 'bg-indigo-600 text-white' : 'border border-slate-700 text-slate-400 hover:text-slate-200'}`}
        >
          Preset
        </button>
        <button
          onClick={() => setMode('custom')}
          className={`text-xs px-3 py-1 rounded-lg transition-colors ${mode === 'custom' ? 'bg-indigo-600 text-white' : 'border border-slate-700 text-slate-400 hover:text-slate-200'}`}
        >
          Personalizzato
        </button>
      </div>

      {mode === 'preset' ? (
        /* Colori preset */
        <div className="flex gap-2 flex-wrap">
          {COLORI.map(c => (
            <button
              key={c}
              onClick={() => onChange(c)}
              className={`w-7 h-7 rounded-full border-2 transition-all ${value === c ? 'border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      ) : (
        /* Colore custom */
        <div className="flex items-center gap-3">
          {/* Tavolozza nativa */}
          <div className="relative">
            <input
              type="color"
              value={value}
              onChange={e => onChange(e.target.value)}
              className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
            />
          </div>

          {/* Hex input */}
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
            <span className="text-slate-500 text-sm">#</span>
            <input
              type="text"
              value={value.replace('#', '')}
              onChange={e => {
                const hex = e.target.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6)
                if (hex.length === 6) onChange(`#${hex}`)
                else if (hex.length === 3) onChange(`#${hex}`)
              }}
              placeholder="f97316"
              maxLength={6}
              className="bg-transparent text-white text-sm w-20 focus:outline-none placeholder-slate-600 font-mono"
            />
          </div>

          {/* Anteprima */}
          <div
            className="w-8 h-8 rounded-full border-2 border-slate-700 flex-shrink-0"
            style={{ backgroundColor: value }}
          />
        </div>
      )}
    </div>
  )
}

function CategoryRow({ cat, onDelete }: { cat: Categoria; onDelete: (cat: Categoria) => void }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ nome: cat.nome, icona: cat.icona, colore: cat.colore })

  async function handleSave() {
    if (!form.nome.trim()) return
    await db.categorie.update(cat.id!, form)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="bg-slate-900 rounded-xl px-4 py-3 border border-indigo-500 space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={form.icona}
            onChange={e => setForm(f => ({ ...f, icona: e.target.value }))}
            className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-center focus:outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            value={form.nome}
            onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
          />
        </div>
        <ColorPicker value={form.colore} onChange={c => setForm(f => ({ ...f, colore: c }))} />
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={!form.nome.trim()}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check size={14} /> Salva
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between bg-slate-900 rounded-xl px-4 py-3 border border-slate-800">
      <div className="flex items-center gap-3">
        <span className="text-xl">{cat.icona}</span>
        <span className="text-sm font-medium">{cat.nome}</span>
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.colore }} />
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setEditing(true)} className="text-slate-500 hover:text-indigo-400 transition-colors">
          <Pencil size={14} />
        </button>
        <button onClick={() => onDelete(cat)} className="text-slate-500 hover:text-rose-400 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

export default function Categories() {
  const [form, setForm] = useState<Omit<Categoria, 'id'>>({ nome: '', icona: '📦', colore: COLORI[0] })
  const [deleteConfirm, setDeleteConfirm] = useState<{ cat: Categoria; count: number } | null>(null)
  const categorie = useLiveQuery(() => db.categorie.toArray())

  async function handleAdd() {
    if (!form.nome.trim()) return
    await db.categorie.add({ ...form })
    setForm({ nome: '', icona: '📦', colore: COLORI[0] })
  }

  async function handleDeleteRequest(cat: Categoria) {
    const count = await db.transazioni.where('categoria_id').equals(cat.id!).count()
    setDeleteConfirm({ cat, count })
  }

  async function handleDeleteConfirm() {
    if (!deleteConfirm) return
    await db.transazioni.where('categoria_id').equals(deleteConfirm.cat.id!).delete()
    await db.categorie.delete(deleteConfirm.cat.id!)
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Categorie</h2>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <p className="text-sm text-slate-400">Nuova categoria</p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="🙂"
            value={form.icona}
            onChange={e => setForm(f => ({ ...f, icona: e.target.value }))}
            className="w-16 bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 text-center focus:outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Nome categoria"
            value={form.nome}
            onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <ColorPicker value={form.colore} onChange={c => setForm(f => ({ ...f, colore: c }))} />
        <button
          onClick={handleAdd}
          disabled={!form.nome.trim()}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={16} /> Aggiungi
        </button>
      </div>

      <div className="space-y-2">
        {categorie?.map(cat => (
          <CategoryRow key={cat.id} cat={cat} onDelete={handleDeleteRequest} />
        ))}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-sm p-6 space-y-4">
            <h3 className="font-semibold text-lg">Elimina categoria</h3>
            <p className="text-slate-400 text-sm">
              Stai eliminando <span className="text-white font-medium">{deleteConfirm.cat.icona} {deleteConfirm.cat.nome}</span>.
              {deleteConfirm.count > 0 && (
                <span className="text-rose-400"> Verranno eliminate anche {deleteConfirm.count} spese collegate.</span>
              )}
            </p>
              <p>
                <span className="text-rose-400">L'operazione non è reversibile.</span>
              </p>

            <div className="flex gap-2">
              <button onClick={handleDeleteConfirm} className="flex-1 bg-rose-600 hover:bg-rose-500 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                Elimina
              </button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-slate-700 hover:border-slate-500 text-slate-300 py-2 rounded-lg text-sm transition-colors">
                Annulla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}