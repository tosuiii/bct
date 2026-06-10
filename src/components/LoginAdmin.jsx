import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../utils/Firebase";

function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);

      // redireciona pro admin
      window.location.href = "/admin";
    } catch (error) {
      alert("Erro no login");
      console.log(error);
    }
  };

  return (
    <div>
      <input
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="senha"
        onChange={(e) => setSenha(e.target.value)}
      />

      <button onClick={login}>Entrar</button>
    </div>
  );
}

export default LoginAdmin;