type CadastroFormProps = {
  form: {
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
  loading: boolean
  searchingCep: boolean
  editingId: number | null
  onChange: (field: string, value: string) => void
  onSubmit: (event: React.FormEvent) => void
  onCancel: () => void
}

export function CadastroForm({ form, loading, searchingCep, editingId, onChange, onSubmit, onCancel }: CadastroFormProps) {
  return (
    <form onSubmit={onSubmit} className="panel-card">
      <div className="panel-header">
        <h3>{editingId ? 'Editar cadastro' : 'Novo cadastro'}</h3>
        <span>{searchingCep ? 'Buscando CEP...' : 'Dados pessoais'}</span>
      </div>

      <div className="grid-form">
        <label>
          Nome
          <input value={form.nome} onChange={(event) => onChange('nome', event.target.value)} required />
        </label>
        <label>
          E-mail
          <input value={form.email} onChange={(event) => onChange('email', event.target.value)} type="email" required />
        </label>
        <label>
          CEP
          <input value={form.cep} onChange={(event) => onChange('cep', event.target.value)} placeholder="00000-000" />
        </label>
        <label>
          Logradouro
          <input value={form.logradouro} onChange={(event) => onChange('logradouro', event.target.value)} required />
        </label>
        <label>
          Número
          <input value={form.numero} onChange={(event) => onChange('numero', event.target.value)} required />
        </label>
        <label>
          Complemento
          <input value={form.complemento} onChange={(event) => onChange('complemento', event.target.value)} />
        </label>
        <label>
          Bairro
          <input value={form.bairro} onChange={(event) => onChange('bairro', event.target.value)} required />
        </label>
        <label>
          Cidade
          <input value={form.cidade} onChange={(event) => onChange('cidade', event.target.value)} required />
        </label>
        <label>
          UF
          <input value={form.uf} onChange={(event) => onChange('uf', event.target.value.toUpperCase())} maxLength={2} required />
        </label>
      </div>

      <div className="actions-row">
        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : editingId ? 'Atualizar' : 'Cadastrar'}
        </button>
        {editingId ? (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancelar
          </button>
        ) : null}
      </div>
    </form>
  )
}
