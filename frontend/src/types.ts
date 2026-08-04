export type User = {
  id: number
  name: string
  email: string
}

export type Cadastro = {
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

export type FormValues = Omit<Cadastro, 'id'>

export type ToastState = {
  message: string
  type: 'success' | 'error'
}
