import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

// Corrige o bug do ícone padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;

const iconBaseUrl = "/leaflet-icons/";

const iconMap = {
  "Trânsito e Acidentes": "marker-icon-red.png",
  "Saúde Pública": "marker-icon-green.png",
  "Iluminação Pública": "marker-icon-yellow.png",
  "Buracos e Pavimentação": "marker-icon-blue.png",
  "Coleta de Lixo e Entulho": "marker-icon-black.png",
  "Água e Esgoto": "marker-icon-blue.png",
  "Segurança Pública": "marker-icon-orange.png",
  "Poluição e Meio Ambiente": "marker-icon-violet.png",
  "Animais na Via Pública": "marker-icon-pink.png",
  "Infraestrutura Urbana": "marker-icon-grey.png",
};

const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  iconSize: [40, 40],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowUrl: iconBaseUrl + "marker-shadow.png", // usa sombra local
  shadowSize: [41, 41],
});

function getCategoriaIcon(categoria) {
  const iconUrl = iconBaseUrl + (iconMap[categoria] || "marker-icon-grey.png");
  return new L.Icon({
    iconUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: iconBaseUrl + "marker-shadow.png", // usa sombra local
    shadowSize: [41, 41],
  });
}

function LocationMarkerWithOcorrencias({ somenteMinhas, categoriaFiltro }) {
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [ocorrencias, setOcorrencias] = useState([]);
  const map = useMap();
  const token = localStorage.getItem("token");
  const idUsuarioLogado = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    map.locate({
      setView: true,
      zoom: 13,
      maxZoom: 18,
      enableHighAccuracy: true,
      timeout: 10000,
    });

    map.on("locationfound", (e) => setPosition(e.latlng));
    map.on("locationerror", (e) => alert("Erro ao obter localização: " + e.message));
  }, [map]);

  //manda um post para pegar todas as correncias
  useEffect(() => {
    const fetchOcorrencias = async () => {
      try {
        const response = await axios.get("http://localhost:8081/api/ocorrencias", {
          headers: { Authorization: `Bearer ${token}` },
        });
        //seta a variavel de ocorrencias para a resposta
        setOcorrencias(response.data);
      } catch (error) {
        console.error("Erro ao buscar ocorrências:", error);
      }
    };

    fetchOcorrencias();
  }, [token]);

  const ocorrenciasFiltradas = ocorrencias.filter((ocorrencia) => {
    const pertenceAoUsuario = ocorrencia.idUsuario === idUsuarioLogado;
    const categoriaCorresponde = categoriaFiltro === "" || ocorrencia.categoria === categoriaFiltro;
    return (!somenteMinhas || pertenceAoUsuario) && categoriaCorresponde;
  });

  return (
    <>
      {position && (
        <Marker position={position} icon={userIcon}>
          <Popup>
            Você está aqui: {position.lat}, {position.lng}
          </Popup>
        </Marker>
      )}

      {ocorrenciasFiltradas.map((ocorrencia, index) => {
        const match = ocorrencia.localizacao?.match(/-?\d+\.\d+/g);
        if (!match || match.length < 2) return null;

        const lat = parseFloat(match[0]);
        const lng = parseFloat(match[1]);
        const categoriaIcon = getCategoriaIcon(ocorrencia.categoria);

        return (
          <Marker key={index} position={[lat, lng]} icon={categoriaIcon}>
            <Popup>
              <strong>{ocorrencia.tituloProblema}</strong><br />
              {ocorrencia.descricao}<br />
              <em>Categoria: {ocorrencia.categoria}</em><br /><br />
                {ocorrencia.foto && (
                    <img
                        src={ocorrencia.foto}
                        alt="Foto da ocorrência"
                        className="img-fluid rounded"
                        style={{
                          right: "20px",
                          width: "110%"
                        }}
                    />
                )}
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}

export default function MapPage() {
  const navigate = useNavigate();
  const [somenteMinhas, setSomenteMinhas] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  return (
    <div className="position-relative" style={{ height: '100vh', width: '100vw' }}>
      {/* Filtros com Bootstrap */}
      <div className="position-absolute top-0 end-0 m-3 p-3 bg-white rounded shadow" style={{ zIndex: 1000, width: '240px' }}>
        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="checkboxMinhas"
            checked={somenteMinhas}
            onChange={() => setSomenteMinhas(!somenteMinhas)}
          />
          <label className="form-check-label" htmlFor="checkboxMinhas">
            Mostrar somente minhas ocorrências
          </label>
        </div>

        <div className="mb-2">
          <label className="form-label">Categoria:</label>
          <select
            className="form-select"
            value={categoriaFiltro}
            onChange={(e) => setCategoriaFiltro(e.target.value)}
          >
            <option value="">Todas</option>
            {Object.keys(iconMap).map((categoria) => (
              <option key={categoria} value={categoria}>{categoria}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Botão flutuante para voltar */}
      <button
        onClick={() => navigate("/dashboard")}
        className="btn btn-dark position-absolute"
        style={{ bottom: "20px", left: "20px", borderRadius: "50%", width: "50px", height: "50px", zIndex: 1000 }}
        title="Voltar ao Dashboard"
      >
        ←
      </button>

      {/* Mapa */}
      <MapContainer center={[-23.65, -52.60]} zoom={13} style={{ height: '100vh', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap"
          maxZoom={19}
        />
        <LocationMarkerWithOcorrencias
          somenteMinhas={somenteMinhas}
          categoriaFiltro={categoriaFiltro}
        />
      </MapContainer>
    </div>
  );
}
