import Dexie, { type EntityTable } from 'dexie'
import type { Categoria, Transazione } from '../types'

export const db = new Dexie('SpeseApp') as Dexie & {
  categorie: EntityTable<Categoria, 'id'>
  transazioni: EntityTable<Transazione, 'id'>
}

db.version(1).stores({
  categorie: '++id, nome',
  transazioni: '++id, categoria_id, data, importo',
})

export async function seedCategorie(): Promise<void> {
  const count = await db.categorie.count()
  if (count > 0) return

  //Categorie prestabilite con colori associati prestabiliti
  await db.categorie.bulkAdd([
    { nome: 'Cibo & Ristoranti', colore: '#f97316', icona: '🍔' },
    { nome: 'Trasporti',         colore: '#3b82f6', icona: '🚗' },
    { nome: 'Svago',             colore: '#a855f7', icona: '🎮' },
    { nome: 'Salute',            colore: '#22c55e', icona: '💊' },
    { nome: 'Casa',              colore: '#eab308', icona: '🏠' },
    { nome: 'Abbigliamento',     colore: '#ec4899', icona: '👕' },
    { nome: 'Altro',             colore: '#6b7280', icona: '📦' },
  ])
}