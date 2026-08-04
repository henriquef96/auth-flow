type Cadastro = {
  id: number
  nome: string
  email: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  cidade: string
  uf: string
}

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
    <div className="panel-card table-card">
      <div className="panel-header">
        <h3>Cadastros cadastrados</h3>
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
                <td>{cadastro.nome}</td>
                <td>{cadastro.email}</td>
                <td>{cadastro.cidade}</td>
                <td>
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
