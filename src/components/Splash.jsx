import "../styles/Splash.scss";

export default function Splash() {
  return (
    <div className="splash-container flex-colum">
      <img src="/entrada.png" alt="Logo" className="logo" />

      <div className="loader"></div>
    </div>
  );
}