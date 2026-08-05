import type { FormEvent } from 'react'
import { CadastroForm } from '../../components/forms/CadastroForm'
import { CadastroList } from '../../components/list/CadastroList'
import type { Cadastro, FormValues, User } from '../../types'
import './AdminPage.css'

type AdminPageProps = {
  user: User
  cadastros: Cadastro[]
  totalCount: number
  loadingList: boolean
  hasMore: boolean
  editingId: number | null
  form: FormValues
  formLoading: boolean
  searchingCep: boolean
  cepStatusMessage: string
  cepStatusType: 'neutral' | 'loading' | 'error'
  onFormChange: (field: keyof FormValues, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  onCancel: () => void
  onEdit: (cadastro: Cadastro) => void
  onDelete: (id: number) => void
  onLoadMore: () => void
}

export function AdminPage({
  user,
  cadastros,
  totalCount,
  loadingList,
  hasMore,
  editingId,
  form,
  formLoading,
  searchingCep,
  cepStatusMessage,
  cepStatusType,
  onFormChange,
  onSubmit,
  onCancel,
  onEdit,
  onDelete,
  onLoadMore,
}: AdminPageProps) {
  return (
    <main className="page-card dashboard-grid">
      <section className="dashboard-column main-column">
        <div className="panel-card summary-card">
          <div className="panel-header">
            <div>
              <h3>Olá, {user.name}</h3>
              <p>Edite ou crie novos cadastros com rapidez e segurança.</p>
            </div>
            <span>{totalCount} registros</span>
          </div>
        </div>

        <CadastroForm
          form={form}
          loading={formLoading}
          searchingCep={searchingCep}
          cepStatusMessage={cepStatusMessage}
          cepStatusType={cepStatusType}
          editingId={editingId}
          onChange={onFormChange}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      </section>

      <section className="dashboard-column side-column">
        <CadastroList
          cadastros={cadastros}
          loading={loadingList}
          hasMore={hasMore}
          onEdit={onEdit}
          onDelete={onDelete}
          onLoadMore={onLoadMore}
        />
      </section>
    </main>
  )
}
