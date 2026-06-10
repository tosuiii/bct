import { useState } from "react";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider
} from "firebase/auth";

import { auth } from "../utils/Firebase";

function Login() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const ADMIN_EMAILS = [
        "anthonydesouzalima1@gmail.com",
        "admin2@gmail.com"
    ];

    const loginEmail = async () => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, senha);

            const userEmail = result.user.email;

            if (!ADMIN_EMAILS.includes(userEmail)) {
                await auth.signOut();
                alert("Acesso negado");
                return;
            }

            window.location.href = "/admin";
        } catch (err) {
            alert("Erro no login");
        }
    };

    const loginGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            const userEmail = result.user.email;

            if (!ADMIN_EMAILS.includes(userEmail)) {
                await auth.signOut();
                alert("Acesso negado");
                return;
            }

            window.location.href = "/admin";
        } catch (err) {
            alert("Erro no Google login");
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h1>Login Admin</h1>

            <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                placeholder="Senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
            />

            <button onClick={loginEmail}>
                Entrar com Email
            </button>

            <br /><br />

            <button onClick={loginGoogle}>
                Entrar com Google
            </button>
        </div>
    );
}

export default Login;