import type { FormEvent } from 'react'
import type { FormValues } from '../../types'

type CadastroFormProps = {
  form: FormValues
  loading: boolean
  searchingCep: boolean
  editingId: number | null
  onChange: (field: keyof FormValues, value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
  onCancel: () => void
}

export function CadastroForm({
  form,
  loading,
  searchingCep,
  editingId,
  onChange,
  onSubmit,
  onCancel,
}: CadastroFormProps) {
  return (
    <form onSubmit={onSubmit} className="panel-card form-card cadastro-form">
      <div className="panel-header">
        <div>
          <h3>{editingId ? 'Editar cadastro' : 'Novo cadastro'}</h3>
          <p>{searchingCep ? 'Consultando CEP...' : 'Preencha os dados abaixo.'}</p>
        </div>
        {editingId ? <span>Modo de edição</span> : null}
      </div>

      <div className="grid-form">
        <label>
          Nome
          <input
            value={form.nome}
            onChange={(event) => onChange('nome', event.target.value)}
            required
            placeholder="Nome completo"
          />
        </label>

        <label>
          E-mail
          <input
            value={form.email}
            onChange={(event) => onChange('email', event.target.value)}
            type="email"
            required
            placeholder="nome@dominio.com"
          />
        </label>

        <label>
          CEP
          <input
            value={form.cep}
            onChange={(event) => onChange('cep', event.target.value)}
            placeholder="00000-000"
          />
        </label>

        <label>
          Logradouro
          <input
            value={form.logradouro}
            onChange={(event) => onChange('logradouro', event.target.value)}
            required
            placeholder="Rua, avenida ou travessa"
          />
        </label>

        <label>
          Número
          <input
            value={form.numero}
            onChange={(event) => onChange('numero', event.target.value)}
            required
            placeholder="Número"
          />
        </label>

        <label>
          Complemento
          <input
            value={form.complemento}
            onChange={(event) => onChange('complemento', event.target.value)}
            placeholder="Apartamento, bloco, etc."
          />
        </label>

        <label>
          Bairro
          <input
            value={form.bairro}
            onChange={(event) => onChange('bairro', event.target.value)}
            required
            placeholder="Bairro"
          />
        </label>

        <label>
          Cidade
          <input
            value={form.cidade}
            onChange={(event) => onChange('cidade', event.target.value)}
            required
            placeholder="Cidade"
          />
        </label>

        <label>
          UF
          <input
            value={form.uf}
            onChange={(event) => onChange('uf', event.target.value.toUpperCase())}
            maxLength={2}
            required
            placeholder="UF"
          />
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
