import { AppLogo } from '../../AppLogo'
import type { User } from '../../../types'
import './AppHeader.css'

type AppHeaderProps = {
  user: User | null
  onLogout: () => void
}

export function AppHeader({ user, onLogout }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-brand">
        <AppLogo />
        <div>
          <strong>Auth Flow</strong>
          <p>Sistema de cadastros com login, edição e listagem.</p>
        </div>
      </div>

      {user ? (
        <div className="user-block">
          <div className="user-meta">
            <span className="user-label">
              <span className="online-dot" aria-hidden="true" />
              Conectado como<strong>{user.name}</strong>
            </span>
            
          </div>
          <button type="button" className="ghost-button" onClick={onLogout}>
            Sair
          </button>
        </div>
      ) : null}
    </header>
  )
}
