import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Plus, Map, Trash , People} from "react-bootstrap-icons"; // Instale com: npm install react-bootstrap-icons

const Dashboard = () => {
  const navigate = useNavigate();
  const [ocorrencias, setOcorrencias] = useState([]);

  const idUsuarioLogado = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!idUsuarioLogado) {
      navigate("/");
    } else {
      fetchOcorrencias();
    }
  }, [navigate]);

  const fetchOcorrencias = async () => {
    try {
      const response = await axios.get(
        `https://reporteurbanoapi.up.railway.app/api/ocorrencias/all/${idUsuarioLogado}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOcorrencias(response.data);
    } catch (error) {
      console.error("Erro ao buscar ocorrências:", error);
    }
  };

  const showMembers = async () => {
    const members = await Swal.fire({
            title: "Quem somos?",
            text: "Somos um grupo de estudantes do curso de Engenharia de Software da faculdade UNICESUMAR que desenvolveu este projeto como parte de um trabalho da faculdade. Nosso objetivo é contribuir para a melhoria da qualidade de vida urbana, facilitando a comunicação entre cidadãos e autoridades locais. Se quiser entrar em contato conosco, pode nos acionar pelo número: +55 44 991219112",
            icon: "question"
        });
  };

    const delOcorrencia = async (idOcorrencia) => {
        //cria um popup de confirmação para o usuário
        const confirm = await Swal.fire({
            title: "Tem certeza?",
            text: "Essa ocorrência será apagada permanentemente.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sim, apagar!",
            cancelButtonText: "Cancelar",
        });

        //realiza o delete apenas se o usuário confirmar
        if (confirm.isConfirmed) {
            try {
                await axios.delete(
                    `https://reporteurbanoapi.up.railway.app/api/ocorrencias/${idOcorrencia}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                Swal.fire("Deletado!", "A ocorrência foi removida.", "success");
                fetchOcorrencias();
            } catch (error) {
                Swal.fire("Erro!", "Erro ao deletar ocorrência.", "error");
            }
        }
    };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container py-4">
      <h2 className="text-success text-center mb-4">Minhas Ocorrências</h2>

      {ocorrencias.length === 0 ? (
        <p className="text-center text-muted">Você ainda não cadastrou nenhuma ocorrência.</p>
      ) : (
        <div className="list-group">
          {ocorrencias.map((ocorrencia) => (
            <div key={ocorrencia.id} className="list-group-item mb-3 shadow-sm rounded">
              <h5 className="mb-1">{ocorrencia.tituloProblema}</h5>
              <small className="text-muted">Categoria: {ocorrencia.categoria}</small>
              <p className="mt-2">{ocorrencia.descricao}</p>
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
                <br /><br />
                <button
                    onClick={() => delOcorrencia(ocorrencia.id)}
                    style={{
                        width: "40px",
                        height: "40px",
                        backgroundColor: "red",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        border: "none", // remove o padrão
                        padding: 0, // remove espaçamento interno
                        cursor: "pointer",
                    }}
                    title="Deletar ocorrência"
                >
                    <Trash size={20} color="white"/>
                </button>
            </div>
          ))}
        </div>
      )}

        <div className="d-flex justify-content-center mt-4">
            <button onClick={handleLogout} className="btn btn-outline-danger">
                Sair
            </button>
        </div>

        {/* Botão flutuante Nova Ocorrência */}
        <button
            className="btn btn-success rounded-circle position-fixed"
            style={{bottom: "20px", right: "20px", width: "60px", height: "60px"}}
        onClick={() => navigate("/nova-ocorrencia")}
      >
        <Plus size={30} color="white" />
      </button>

      <button
            className="btn btn-success rounded-circle position-fixed"
            style={{bottom: "80px", right: "20px", width: "60px", height: "60px", background: "gray"}}
        onClick={showMembers}
      >
        <People size={30} color="white" />
      </button>

      {/* Botão flutuante Mapa */}
      <button
        className="btn btn-primary rounded-circle position-fixed"
        style={{ bottom: "20px", left: "20px", width: "60px", height: "60px" }}
        onClick={() => navigate("/mapa")}
      >
        <Map size={26} color="white" />
      </button>
    </div>
  );

};

export default Dashboard;
