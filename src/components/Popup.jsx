import "../styles/Popup.scss";

function Popup({
  instrucao,
  podeResponder,
  resposta,
  setResposta,
  enviarResposta
}) {
  return (
    <div className="popup flex-center">
      <div className="conteudo flex-colum gap-md">

        <div className="logo-box flex-center">
          <img src="/logo.svg" alt="Logo" />
        </div>

        <p className="texto">
          {instrucao}
        </p>

        {/* ✍️ INPUT */}
        {podeResponder && (
          <div className="resposta-box flex-colum gap-md">

            <input
              type="text"
              placeholder="Digite sua resposta..."
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
            />

            <button className="btn" onClick={enviarResposta}>
              Enviar
            </button>

          </div>
        )}

      </div>
    </div>
  );
}

export default Popup;