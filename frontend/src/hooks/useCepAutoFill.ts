import { useEffect } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import { buildUrl, fetchJson } from '../lib/api'
import type { FormValues } from '../types'

type CepLookupResponse = Pick<FormValues, 'cep' | 'logradouro' | 'bairro' | 'cidade' | 'uf'>

export function useCepAutoFill(
    cep: string,
    setForm: Dispatch<SetStateAction<FormValues>>,
    setSearchingCep: Dispatch<SetStateAction<boolean>>,
) {
    useEffect(() => {
        const cepClean = cep.replace(/\D/g, '')
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
    }, [cep, setForm, setSearchingCep])
}
