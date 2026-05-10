import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db/database'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function meseKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

function inizioMese(key: string) {
  const [year, month] = key.split('-')
  return new Date(parseInt(year), parseInt(month) - 1, 1).toISOString()
}

function fineMese(key: string) {
  const [year, month] = key.split('-')
  return new Date(parseInt(year), parseInt(month), 1).toISOString()
}

function labelMese(key: string) {
  const [year, month] = key.split('-')
  const d = new Date(parseInt(year), parseInt(month) - 1, 1)
  const label = d.toLocaleString('it', { month: 'long', year: 'numeric' })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export default function Dashboard() {
  const oggi = new Date()
  const [meseCorrente, setMeseCorrente] = useState(meseKey(oggi))

  // Tutte le transazioni per ricavare il primo mese disponibile
  const tutteTransazioni = useLiveQuery(() => db.transazioni.orderBy('data').toArray())

  // Transazioni del mese selezionato
  const transazioni = useLiveQuery(() =>
    db.transazioni
      .where('data')
      .between(inizioMese(meseCorrente), fineMese(meseCorrente))
      .toArray()
  , [meseCorrente])

  const categorie = useLiveQuery(() => db.categorie.toArray())

  if (!transazioni || !categorie || !tutteTransazioni) return <p className="text-slate-400">Caricamento...</p>

  // Mese minimo — primo mese con una spesa
  const primoMese = tutteTransazioni.length > 0
    ? meseKey(new Date(tutteTransazioni[0].data))
    : meseKey(oggi)

  const maxMese = meseKey(oggi)

  function mesePrecedente() {
    const [year, month] = meseCorrente.split('-').map(Number)
    const d = new Date(year, month - 2, 1)
    setMeseCorrente(meseKey(d))
  }

  function meseSuccessivo() {
    const [year, month] = meseCorrente.split('-').map(Number)
    const d = new Date(year, month, 1)
    setMeseCorrente(meseKey(d))
  }

  const puoAndareIndietro = meseCorrente > primoMese
  const puoAndareAvanti = meseCorrente < maxMese

  const totale = transazioni.reduce((s, t) => s + t.importo, 0)
  const media = transazioni.length > 0 ? totale / transazioni.length : 0

  const catMap = Object.fromEntries(categorie.map(c => [c.id!, c]))

  const perCategoria = categorie.map(cat => ({
    nome: cat.nome,
    icona: cat.icona,
    colore: cat.colore,
    totale: transazioni
      .filter(t => t.categoria_id === cat.id)
      .reduce((s, t) => s + t.importo, 0),
  })).filter(c => c.totale > 0).sort((a, b) => b.totale - a.totale)

  const topCategoria = perCategoria[0] ?? null

  const ultime = [...transazioni]
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 3)

  return (
    <div className="space-y-4">

      {/* Navigazione mese */}
      <div className="flex items-center justify-between">
        <button
          onClick={mesePrecedente}
          disabled={!puoAndareIndietro}
          className="p-2 rounded-lg transition-colors disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-800"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">{labelMese(meseCorrente)}</h2>
        <button
          onClick={meseSuccessivo}
          disabled={!puoAndareAvanti}
          className="p-2 rounded-lg transition-colors disabled:opacity-20 disabled:cursor-not-allowed hover:bg-slate-800"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {transazioni.length === 0 ? (
        <p className="text-slate-500 text-center mt-12">
          Nessuna spesa per {labelMese(meseCorrente).toLowerCase()}.
        </p>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Totale speso</p>
              <p className="text-2xl font-bold text-rose-400">€ {totale.toFixed(2)}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Spesa media</p>
              <p className="text-2xl font-bold text-white">€ {media.toFixed(2)}</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">Transazioni</p>
              <p className="text-2xl font-bold text-white">{transazioni.length}</p>
            </div>
            {topCategoria && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">Top categoria</p>
                <p className="text-lg font-bold text-white">{topCategoria.icona} {topCategoria.nome}</p>
              </div>
            )}
          </div>

          {/* Breakdown categorie */}
          {perCategoria.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <p className="text-sm text-slate-400">Per categoria</p>
              {perCategoria.map(cat => (
                <div key={cat.nome} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{cat.icona} {cat.nome}</span>
                    <span className="text-slate-300">€ {cat.totale.toFixed(2)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(cat.totale / totale) * 100}%`,
                        backgroundColor: cat.colore,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ultime spese */}
          {ultime.length > 0 && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <p className="text-sm text-slate-400">Ultime spese</p>
              {ultime.map(t => {
                const cat = catMap[t.categoria_id]
                return (
                  <div key={t.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{cat?.icona ?? '📦'}</span>
                      <span className="text-sm">{t.nota || cat?.nome}</span>
                    </div>
                    <span className="text-sm text-rose-400 font-medium">- € {t.importo.toFixed(2)}</span>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}