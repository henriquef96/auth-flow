import type { FormEvent } from 'react'
import { LoginForm } from '../../components/forms/LoginForm'
import './LoginPage.css'

type LoginPageProps = {
  email: string
  password: string
  loading: boolean
  error: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>
}

export function LoginPage({
  email,
  password,
  loading,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: LoginPageProps) {
  return (
    <main className="page-card login-page">
      <section className="hero-card">
        <div>
          <span className="eyebrow">Acesso rápido</span>
          <h1>Entre com seguranca e gerencie seus cadastros.</h1>
          <p><br />
            Uma experiencia de navegacao fluida, com interface moderna e responsiva.
          </p>
        </div>
      </section>

      <section className="auth-card">
        <div className="panel-header">
          <div className="panel-header-content">
            <h2 className="login-title">Bem-vindo de volta!</h2>
            <p>Insira seu e-mail e senha para acessar.</p><br />
          </div>
        </div>

        <LoginForm
          email={email}
          password={password}
          loading={loading}
          error={error}
          onEmailChange={onEmailChange}
          onPasswordChange={onPasswordChange}
          onSubmit={onSubmit}
        />
      </section>
    </main>
  )
}
