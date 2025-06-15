import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLoading } from "../context/LoadingContext"; // IMPORTAÇÃO DO CONTEXTO

// Corrigindo o ícone do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ClickableMap = ({ setLocalizacao, userPosition }) => {
  useMapEvents({
    click(e) {
      const coords = `${e.latlng.lat},${e.latlng.lng}`;
      setLocalizacao(coords);
    }
  });

  return userPosition && (
    <Marker position={userPosition}>
      <Popup>Você está aqui</Popup>
    </Marker>
  );
};

const NovaOcorrencia = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { setIsLoading } = useLoading(); // Hook do loading

  const [userId, setUserId] = useState(localStorage.getItem("userId"));
  const [tituloProblema, setTituloProblema] = useState("");
  const [descricao, setDescricao] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [foto, setFoto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [respostaIA, setRespostaIA] = useState("");
  const [userPosition, setUserPosition] = useState(null);
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
          setLocalizacao(`${latitude},${longitude}`);
        },
        (error) => console.error("Erro ao obter localização:", error),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // ⏳ Mostra o loading

    let coords = localizacao;
    if (!coords) {
      coords = await new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => resolve(`${coords.latitude},${coords.longitude}`),
          () => resolve(""),
          { enableHighAccuracy: true }
        );
      });
    }

    const novaOcorrencia = {
      tituloProblema,
      categoria,
      descricao,
      localizacao: coords,
      foto,
      userId
    };

    try {
      const response = await axios.post(
        "https://reporteurbanoapi.up.railway.app/api/ocorrencias",
        novaOcorrencia,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const descricaoIA = response.data?.descricaoIa || response.data?.ocorrencia?.descricaoIa || "";
      setRespostaIA(descricaoIA);
      setMensagem("Ocorrência enviada com sucesso!");
      setTituloProblema("");
      setDescricao("");
      setLocalizacao("");
      setFoto("");

      //confirmação que criou
      Swal.fire("Sucesso!", "A ocorrência foi criada com sucesso.", "success");
    } catch (error) {
      console.error("Erro ao criar ocorrência:", error);
      setMensagem("Erro ao criar ocorrência.");
    } finally {
      setIsLoading(false); // ✅ Esconde o loading
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center flex-column py-4">
      <div className="col-lg-8 col-md-10 col-sm-12">
        <h2 className="mb-4 text-center">Nova Ocorrência</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Título do problema"
              value={tituloProblema}
              onChange={(e) => setTituloProblema(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <select
              className="form-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="">Selecione uma categoria</option>
              <option value="Trânsito e Acidentes">Trânsito e Acidentes</option>
              <option value="Saúde Pública">Saúde Pública</option>
              <option value="Iluminação Pública">Iluminação Pública</option>
              <option value="Buracos e Pavimentação">Buracos e Pavimentação</option>
              <option value="Coleta de Lixo e Entulho">Coleta de Lixo e Entulho</option>
              <option value="Água e Esgoto">Água e Esgoto</option>
              <option value="Segurança Pública">Segurança Pública</option>
              <option value="Poluição e Meio Ambiente">Poluição e Meio Ambiente</option>
              <option value="Animais na Via Pública">Animais na Via Pública</option>
              <option value="Infraestrutura Urbana">Infraestrutura Urbana</option>
            </select>
          </div>

          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Descrição do problema"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            />
          </div>

          <div className="mb-3" style={{ height: "300px" }}>
            {userPosition && (
              <MapContainer center={userPosition} zoom={15} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <ClickableMap setLocalizacao={setLocalizacao} userPosition={userPosition} />
                {localizacao && (
                  <Marker position={localizacao.split(',').map(Number)}>
                    <Popup>Local selecionado</Popup>
                  </Marker>
                )}
              </MapContainer>
            )}
          </div>

          <div className="mb-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>

          <button type="submit" className="btn btn-success w-100">Enviar Ocorrência</button>
        </form>

        {mensagem && <p className="mt-3 text-success text-center">{mensagem}</p>}

        {respostaIA && (
          <div className="text-center mt-4">
            <h4>Orientação da IA:</h4>
            <p>{respostaIA}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="btn btn-secondary mt-3"
            >
              Voltar para o Início
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className="btn btn-outline-dark position-fixed"
        style={{ bottom: "20px", left: "20px", borderRadius: "50%", width: "50px", height: "50px" }}
        title="Voltar ao Dashboard"
      >
        ←
      </button>
    </div>
  );
};

export default NovaOcorrencia;
