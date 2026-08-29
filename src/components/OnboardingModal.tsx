import { useState } from 'react'
import { Info } from 'lucide-react'

export default function OnboardingModal() {
  const [visible, setVisible] = useState(() => {
    return localStorage.getItem('onboarding_shown') !== 'true'
  })

  function handleClose() {
    localStorage.setItem('onboarding_shown', 'true')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-md p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center flex-shrink-0">
            <Info size={20} className="text-indigo-400" />
          </div>
          <h3 className="font-semibold text-lg">Benvenuto in Paduck 🦆</h3>
        </div>

        <div className="space-y-3 text-sm text-slate-400">
          <p>
            Paduck salva tutti i tuoi dati <span className="text-white font-medium">direttamente sul tuo dispositivo</span>, senza nessun server esterno. I tuoi dati sono solo tuoi.
          </p>
          <p>
            ⚠️ Se cancelli i dati del browser o la cronologia, <span className="text-rose-400 font-medium">perderai tutte le spese salvate</span> senza possibilità di recupero.
          </p>
          <p>
            💡 Ti consigliamo di <span className="text-white font-medium">esportare regolarmente un backup</span> dalla pagina Spese — ci vogliono due secondi.
          </p>
        </div>

        <button
          onClick={handleClose}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-medium transition-colors"
        >
          Ho capito, iniziamo!
        </button>
      </div>
    </div>
  )
}