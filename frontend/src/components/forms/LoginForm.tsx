import type { FormEvent } from 'react'

type LoginFormProps = {
  email: string
  password: string
  loading: boolean
  error: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

export function LoginForm({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className="panel-card form-card auth-form">
      <label>
        E-mail
        <input
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          type="email"
          required
          placeholder="seu@email.com"
        />
      </label>

      <label>
        Senha
        <input
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          type="password"
          required
          placeholder="Digite sua senha"
        />
      </label>

      {error ? <p className="error-text">{error}</p> : null}
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  )
}
