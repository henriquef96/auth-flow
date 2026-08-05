import { useEffect } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { buildUrl, fetchJson } from '../lib/api'
import type { FormValues } from '../types'

type CepLookupResponse = Pick<FormValues, 'cep' | 'logradouro' | 'bairro' | 'cidade' | 'uf'>
type CepStatusType = 'neutral' | 'loading' | 'error'

export function useCepAutoFill(
    cep: string,
    setForm: Dispatch<SetStateAction<FormValues>>,
    setSearchingCep: Dispatch<SetStateAction<boolean>>,
    setCepStatusMessage: Dispatch<SetStateAction<string>>,
    setCepStatusType: Dispatch<SetStateAction<CepStatusType>>,
) {
    useEffect(() => {
        const cepClean = cep.replace(/\D/g, '')
        if (cepClean.length !== 8) {
            setSearchingCep(false)
            setCepStatusMessage('')
            setCepStatusType('neutral')
            return
        }

        const controller = new AbortController()
        const timeoutId = window.setTimeout(async () => {
            setSearchingCep(true)
            setCepStatusMessage('Consultando CEP...')
            setCepStatusType('loading')

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
                setCepStatusMessage('')
                setCepStatusType('neutral')
            } catch (error) {
                if ((error as Error).name === 'AbortError') {
                    return
                }

                const errorMessage = (error as Error).message.toLowerCase()
                const cepNotFound = errorMessage.includes('nao encontrado') || errorMessage.includes('não encontrado')

                setCepStatusMessage(cepNotFound ? 'CEP não encontrado.' : 'Erro ao consultar CEP.')
                setCepStatusType('error')
                setForm((current) => ({
                    ...current,
                    logradouro: '',
                    bairro: '',
                    cidade: '',
                    uf: '',
                }))
            } finally {
                setSearchingCep(false)
            }
        }, 450)

        return () => {
            window.clearTimeout(timeoutId)
            controller.abort()
        }
    }, [cep, setCepStatusMessage, setCepStatusType, setForm, setSearchingCep])
}