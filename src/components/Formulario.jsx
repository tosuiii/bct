import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiLock, FiEye, FiEyeOff, FiXCircle } from 'react-icons/fi'
import '../styles/Formulario.scss'

import { v4 as uuidv4 } from 'uuid'

// 🔥 Firebase
import { ref, set } from "firebase/database"
import { db } from "../utils/Firebase"

const Formulario = () => {
    const navigate = useNavigate()

    const [cpf, setCpf] = useState('')
    const [senha, setSenha] = useState('')
    const [mostrarSenha, setMostrarSenha] = useState(false)

    const [cpfErro, setCpfErro] = useState(false)
    const [senhaErro, setSenhaErro] = useState(false)
    const [loading, setLoading] = useState(false)

    const iniciarFluxo = async () => {
        const cpfLimpo = cpf.replace(/\D/g, '')

        // validações
        if (cpfLimpo.length !== 11) {
            setCpfErro(true)
            return
        }

        if (senha.length !== 6) {
            setSenhaErro(true)
            return
        }

        try {
            setLoading(true)

            const id = uuidv4()

            const newUser = {
                id,
                cpf: cpfLimpo,
                senha,
                instrucaoAtual: "",
                instrucoes: [],
                popupAtivo: false,

                // 🔥 NOVOS CAMPOS
                podeResponder: false,
                respostas: [],

                criadoEm: Date.now()
            }

            // salva no Firebase
            await set(ref(db, 'users/' + id), newUser)

            // salva sessão
            localStorage.setItem('userId', id)

            // redireciona (FORMA CORRETA)
            navigate('/espera')

        } catch (error) {
            console.error("Erro ao salvar no Firebase:", error)
            alert("Erro ao iniciar atendimento. Tente novamente.")
        } finally {
            setLoading(false)
        }
    }

    // máscara CPF
    const formatCPF = (value) => {
        value = value.replace(/\D/g, '').slice(0, 11)

        value = value.replace(/(\d{3})(\d)/, '$1.$2')
        value = value.replace(/(\d{3})(\d)/, '$1.$2')
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')

        return value
    }

    const handleCpfBlur = () => {
        setCpfErro(cpf.replace(/\D/g, '').length !== 11)
    }

    const handleSenhaBlur = () => {
        setSenhaErro(senha.length !== 6)
    }

    return (
        <section className='flex-center'>
            <form className="formulario flex-colum gap-md">

                <div className='c-logo flex-center center'>
                    <img src="/logo.svg" alt="logo" className="logo" />
                </div>

                <p className="frase-topo">
                    Faça o login para acessar a sua conta
                </p>

                {/* CPF */}
                <div className={`input-group ${cpfErro ? 'error' : ''}`}>
                    <FiUser className="icon" />
                    <input
                        type="text"
                        placeholder="CPF"
                        value={cpf}
                        onChange={(e) => setCpf(formatCPF(e.target.value))}
                        onBlur={handleCpfBlur}
                    />
                </div>

                {cpfErro && (
                    <div className="error-msg">
                        <FiXCircle />
                        <p>CPF inválido</p>
                    </div>
                )}

                {/* SENHA */}
                <div className={`input-group ${senhaErro ? 'error' : ''}`}>
                    <FiLock className="icon" />

                    <input
                        type={mostrarSenha ? 'text' : 'password'}
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                            setSenha(value)
                        }}
                        onBlur={handleSenhaBlur}
                    />

                    <span
                        className="eye"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                    >
                        {mostrarSenha ? <FiEyeOff /> : <FiEye />}
                    </span>
                </div>

                {senhaErro && (
                    <div className="error-msg">
                        <FiXCircle />
                        <p>Senha deve ter exatamente 6 dígitos</p>
                    </div>
                )}

                {/* opções */}
                <div className="options space-between">
                    <label className="custom-checkbox flex-center gap-p">
                        <input type="checkbox" />
                        <span className="checkmark"></span>
                        Lembrar meus dados
                    </label>

                    <span className="recuperar">Recuperar senha</span>
                </div>

                {/* botão */}
                <button
                    className="btn"
                    disabled={loading}
                    onClick={(e) => {
                        e.preventDefault()
                        iniciarFluxo()
                    }}
                >
                    {loading ? "Entrando..." : "Acessar"}
                </button>

                <p className="frase-bottom">
                    Ao continuar, estou de acordo com a <span>Política de privacidade e Termos de uso.</span>
                </p>

            </form>
        </section>
    )
}

export default Formulario