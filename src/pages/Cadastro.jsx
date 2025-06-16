import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingContext"; //  Importa o contexto de loading

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [cep, setCep] = useState("");
  const [genero, setGenero] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsLoading } = useLoading(); //  Usa o hook do loading

  const handleCadastro = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); //  Mostra o loading

    try {
      const response = await fetch("https://reporteurbanoapi.up.railway.app/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cpf, cep, genero }),
      });

      let data;
      try {
        data = await response.json();
      } catch (err) {
        setError("Erro inesperado do servidor.");
        return;
      }

      if (response.ok) {
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setError(data.error || "Erro ao cadastrar. Tente novamente.");
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setIsLoading(false); // ✅ Esconde o loading
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100 bg-light px-4">
      <h1 className="mb-4 text-success text-center">Cadastro</h1>

      <form className="w-100" style={{ maxWidth: "400px" }} onSubmit={handleCadastro}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nome Completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>

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

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Gênero:</label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="genero"
              value="Masculino"
              checked={genero === "Masculino"}
              onChange={(e) => setGenero(e.target.value)}
              required
            />
            <label className="form-check-label">Masculino</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="genero"
              value="Feminino"
              checked={genero === "Feminino"}
              onChange={(e) => setGenero(e.target.value)}
              required
            />
            <label className="form-check-label">Feminino</label>
          </div>
        </div>

        <button type="submit" className="btn btn-success w-100">
          Cadastrar
        </button>
      </form>

      {error && <div className="alert alert-danger mt-3 w-100 text-center">{error}</div>}

      <p className="mt-3 text-muted text-center">
        Já tem conta?{" "}
        <Link to="/" className="text-success fw-bold text-decoration-none">
          Entrar
        </Link>
      </p>
    </div>
  );
};

export default Cadastro;
