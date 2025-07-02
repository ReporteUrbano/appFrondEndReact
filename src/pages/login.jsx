import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://reporteurbanoapi.up.railway.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf }),
      });

      const contentType = response.headers.get("content-type");

      if (!response.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          setError(errorData.message || errorData.error || "Erro ao fazer login");
        } else {
          setError("Usuário não encontrado ou erro inesperado.");
        }
        return;
      }

      const data = await response.json();
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Erro de rede ou servidor:", err);
      setError("Erro de conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light px-4 login-container">
      <img
        src={"/leaflet-icons/LogoReporteUrbano.jpeg"}
        className="img-fluid login-logo"
        style={{ width: "75%", height: "auto", marginBottom: "15%" }}
        alt="Logo"
      />

      <form className="w-100 login-form" onSubmit={handleLogin}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? "Carregando..." : "Entrar"}
        </button>
      </form>

      {error && (
        <div className="alert alert-danger mt-3 w-100 text-center login-error">
          {error}
        </div>
      )}

      <p className="mt-3 text-muted text-center">
        Não tem conta?{" "}
        <Link to="/cadastro" className="text-success fw-bold text-decoration-none">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
};

export default Login;