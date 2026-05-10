import { useState } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Expenses from './pages/Expenses'
import Categories from './pages/Categories'

type Page = 'dashboard' | 'expenses' | 'categories'

export default function App() {
  const [page, setPage] = useState<Page>('dashboard')

  const pages: Record<Page, React.ReactNode> = {
    dashboard: <Dashboard />,
    expenses: <Expenses />,
    categories: <Categories />,
  }

  return (
    <Layout page={page} setPage={setPage}>
      {pages[page]}
    </Layout>
  )
}