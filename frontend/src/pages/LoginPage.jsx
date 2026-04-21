import { useState } from "react";

function LoginPage({ onLogin }) {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      // TODO: API de login
      console.log("Login:", form);

      setStatus({ type: "success", message: "Login realizado!" });

      if (onLogin) onLogin();
    } catch (err) {
      setStatus({ type: "error", message: "Email ou senha inválidos" });
    }
  }

  return (
    <section className="hero-card">
      <div className="hero-copy">
        <p className="eyebrow">Bem-vindo de volta</p>
        <h2>Entrar</h2>
        <p>Acesse sua conta para realizar seus pedidos.</p>
      </div>

      <div className="form-card">
        <form className="product-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>

          <label>
            <span>Senha</span>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>

          {status && (
            <p className={`status-message ${status.type}`}>
              {status.message}
            </p>
          )}

          <button className="submit-button" type="submit">
            Entrar
          </button>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;