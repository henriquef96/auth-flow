import type { Cadastro } from '../../types'

type CadastroListProps = {
  cadastros: Cadastro[]
  loading: boolean
  hasMore: boolean
  onEdit: (cadastro: Cadastro) => void
  onDelete: (id: number) => void
  onLoadMore: () => void
}

export function CadastroList({ cadastros, loading, hasMore, onEdit, onDelete, onLoadMore }: CadastroListProps) {
  return (
    <div className="panel-card table-card cadastro-list-card">
      <div className="panel-header">
        <div>
          <h3>Lista de cadastros</h3>
          <p>Visualize e atualize seus usuários imediatamente.</p>
        </div>
        <span>{cadastros.length} registros</span>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Cidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {cadastros.map((cadastro) => (
              <tr key={cadastro.id}>
                <td data-label="Nome">{cadastro.nome}</td>
                <td data-label="E-mail">{cadastro.email}</td>
                <td data-label="Cidade">{cadastro.cidade}</td>
                <td data-label="Ações" className="actions-cell">
                  <button className="table-button" onClick={() => onEdit(cadastro)}>
                    Editar
                  </button>
                  <button className="table-button danger" onClick={() => onDelete(cadastro.id)}>
                    Remover
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasMore ? (
        <div className="actions-row load-more-row">
          <button type="button" className="ghost-button" onClick={onLoadMore} disabled={loading}>
            {loading ? 'Carregando...' : 'Carregar mais'}
          </button>
        </div>
      ) : null}
    </div>
  )
}
