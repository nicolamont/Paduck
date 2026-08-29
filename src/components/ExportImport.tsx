import { useState } from 'react'
import { db } from '../db/database'
import { Download, Upload, AlertTriangle, Clock } from 'lucide-react'
import type { BackupData } from '../types'

function formatData(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('it', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function ExportImport() {
  const [lastBackup, setLastBackup] = useState<string | null>(
    () => localStorage.getItem('last_backup')
  )

  async function handleExport() {
    const categorie = await db.categorie.toArray()
    const transazioni = await db.transazioni.toArray()
    const payload: BackupData = {
      version: 1,
      exported_at: new Date().toISOString(),
      categorie,
      transazioni,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `paduck_backup_${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)

    const now = new Date().toISOString()
    localStorage.setItem('last_backup', now)
    setLastBackup(now)
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    const data: BackupData = JSON.parse(text)
    if (data.version !== 1) return alert('Formato non supportato')
    await db.categorie.clear()
    await db.transazioni.clear()
    await db.categorie.bulkAdd(data.categorie)
    await db.transazioni.bulkAdd(data.transazioni)
    alert('Importazione completata!')
  }

  const noBackup = !lastBackup

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition-colors"
        >
          <Download size={14} /> Esporta
        </button>
        <label className="flex items-center gap-2 border border-slate-700 hover:border-slate-500 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition-colors cursor-pointer">
          <Upload size={14} /> Importa
          <input type="file" accept=".json" onChange={handleImport} className="hidden" />
        </label>
      </div>

      {/* Indicatore ultimo backup */}
      {noBackup ? (
        <div className="flex items-center gap-2 text-xs text-amber-400">
          <AlertTriangle size={13} />
          <span>Nessun backup effettuato — ti consigliamo di esportare i tuoi dati</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock size={13} />
          <span>Ultimo backup: {formatData(lastBackup!)}</span>
        </div>
      )}
    </div>
  )
}