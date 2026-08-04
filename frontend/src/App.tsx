import { useEffect, useState } from 'react'
import './App.css'
import { LoginPage } from './pages/LoginPage'
import { AdminPage } from './pages/AdminPage'
import { Toast } from './components/Toast'
import { AppLogo } from './components/AppLogo'
import { buildUrl, fetchJson } from './lib/api'
import type { Cadastro, FormValues, ToastState, User } from './types'

const STORAGE_KEY = 'auth_token'

const initialForm: FormValues = {
  nome: '',
  email: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: '',
}

type CepLookupResponse = Pick<FormValues, 'cep' | 'logradouro' | 'bairro' | 'cidade' | 'uf'>

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY))
  const [loginEmail, setLoginEmail] = useState('admin@authflow.test')
  const [loginPassword, setLoginPassword] = useState('admin@test')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [cadastros, setCadastros] = useState<Cadastro[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)
  const [loadingList, setLoadingList] = useState(false)
  const [form, setForm] = useState<FormValues>(initialForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [searchingCep, setSearchingCep] = useState(false)
  const [toast, setToast] = useState<ToastState>({ message: '', type: 'success' })

  useEffect(() => {
    if (!token || user) {
      return
    }

    const controller = new AbortController()

    async function bootstrap() {
      try {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }

        const [payload] = await Promise.all([
          fetchJson<{ user: User }>(buildUrl('/me'), {
            method: 'GET',
            headers,
            signal: controller.signal,
          }),
          loadCadastros(1, token),
        ])

        setUser(payload.user)
      } catch {
        handleLogout()
      }
    }

    bootstrap()

    return () => controller.abort()
  }, [token, user])

  useEffect(() => {
    if (!toast.message) {
      return
    }

    const timeout = window.setTimeout(() => {
      setToast({ message: '', type: 'success' })
    }, 3200)

    return () => window.clearTimeout(timeout)
  }, [toast.message])

  useEffect(() => {
    const cepClean = form.cep.replace(/\D/g, '')
    if (cepClean.length !== 8) {
      return
    }

    const controller = new AbortController()
    const timeoutId = window.setTimeout(async () => {
      setSearchingCep(true)

      try {
        const data = await fetchJson<CepLookupResponse>(buildUrl(`/cep/${cepClean}`), {
          method: 'GET',
          signal: controller.signal,
        })

        setForm((current) => ({
          ...current,
          logradouro: data.logradouro || current.logradouro,
          bairro: data.bairro || current.bairro,
          cidade: data.cidade || current.cidade,
          uf: data.uf || current.uf,
        }))
      } catch {
      } finally {
        setSearchingCep(false)
      }
    }, 450)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [form.cep])

  async function loadCadastros(requestPage: number, tokenValue: string | null = token) {
    try {
      setLoadingList(true)
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(tokenValue ? { Authorization: `Bearer ${tokenValue}` } : {}),
      }

      const data = await fetchJson<Cadastro[]>(buildUrl(`/cadastros?page=${requestPage}`), {
        method: 'GET',
        headers,
      })

      setCadastros((current) => (requestPage === 1 ? data : [...current, ...data]))
      setHasMore(data.length === 5)
      setPage(requestPage)
    } catch (error) {
      setToast({ message: (error as Error).message || 'Erro ao buscar cadastros.', type: 'error' })
    } finally {
      setLoadingList(false)
    }
  }

  async function handleLogin(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    try {
      const payload = await fetchJson<{ token: string; user: User }>(buildUrl('/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })

      const newToken = payload.token
      localStorage.setItem(STORAGE_KEY, newToken)
      setToken(newToken)
      setUser(payload.user)
      setLoginEmail('')
      setLoginPassword('')
      setToast({ message: 'Login realizado com sucesso.', type: 'success' })
      await loadCadastros(1, newToken)
    } catch (error) {
      setLoginError((error as Error).message)
    } finally {
      setLoginLoading(false)
    }
  }

  async function handleSubmitCadastro(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    if (!token) {
      return
    }

    setFormLoading(true)
    const method = editingId ? 'PUT' : 'POST'
    const url = editingId ? `/cadastros/${editingId}` : '/cadastros'

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }

      const payload = await fetchJson<{ mensagem: string }>(buildUrl(url), {
        method,
        headers,
        body: JSON.stringify(form),
      })

      setToast({ message: payload.mensagem || 'Cadastro salvo com sucesso.', type: 'success' })
      setForm(initialForm)
      setEditingId(null)
      await loadCadastros(1)
    } catch (error) {
      setToast({ message: (error as Error).message, type: 'error' })
    } finally {
      setFormLoading(false)
    }
  }

  function handleFormChange(field: keyof FormValues, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function handleEdit(cadastro: Cadastro) {
    setEditingId(cadastro.id)
    setForm({
      nome: cadastro.nome,
      email: cadastro.email,
      cep: cadastro.cep,
      logradouro: cadastro.logradouro,
      numero: cadastro.numero,
      complemento: cadastro.complemento,
      bairro: cadastro.bairro,
      cidade: cadastro.cidade,
      uf: cadastro.uf,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(id: number) {
    if (!token || !window.confirm('Deseja realmente excluir este cadastro?')) {
      return
    }

    try {
      setLoadingList(true)
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      }

      const payload = await fetchJson<{ mensagem: string }>(buildUrl(`/cadastros/${id}`), {
        method: 'DELETE',
        headers,
      })

      setToast({ message: payload.mensagem || 'Cadastro excluído com sucesso.', type: 'success' })
      await loadCadastros(1)
    } catch (error) {
      setToast({ message: (error as Error).message, type: 'error' })
    } finally {
      setLoadingList(false)
    }
  }

  function handleCancelEdit() {
    setEditingId(null)
    setForm(initialForm)
  }

  function handleLogout() {
    setToken(null)
    setUser(null)
    setCadastros([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <AppLogo />
          <div>
            <strong>Auth Flow</strong>
            <p>Sistema de cadastros com login, edição e listagem</p>
          </div>
        </div>

        {user ? (
          <div className="user-block">
            <div>
              <span>Conectado como</span>
              <strong>{user.name}</strong>
            </div>
            <button type="button" className="ghost-button" onClick={handleLogout}>
              Sair
            </button>
          </div>
        ) : null}
      </header>

      {toast.message ? <Toast message={toast.message} type={toast.type} /> : null}

      {!token ? (
        <LoginPage
          email={loginEmail}
          password={loginPassword}
          loading={loginLoading}
          error={loginError}
          onEmailChange={setLoginEmail}
          onPasswordChange={setLoginPassword}
          onSubmit={handleLogin}
        />
      ) : user ? (
        <AdminPage
          user={user}
          cadastros={cadastros}
          totalCount={cadastros.length}
          loadingList={loadingList}
          hasMore={hasMore}
          editingId={editingId}
          form={form}
          formLoading={formLoading}
          searchingCep={searchingCep}
          onFormChange={handleFormChange}
          onSubmit={handleSubmitCadastro}
          onCancel={handleCancelEdit}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onLoadMore={() => loadCadastros(page + 1)}
        />
      ) : null}
    </div>
  )
}

export default App
