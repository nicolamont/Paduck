export interface Categoria {
  id?: number
  nome: string
  icona: string
  colore: string
}

export interface Transazione {
  id?: number
  importo: number
  categoria_id: number
  nota: string
  data: string
}

export interface BackupData {
  version: number
  exported_at: string
  categorie: Categoria[]
  transazioni: Transazione[]
}