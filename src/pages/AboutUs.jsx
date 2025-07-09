import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Github, Linkedin } from "react-bootstrap-icons"; 

const AboutUs = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: "Henrique Zolin",
      linkedin: "https://www.linkedin.com/in/henrique-zolin-medeiros/",
    },
    {
      name: "Rafael Gebara",
      linkedin: "https://www.linkedin.com/in/rafael-gebara-578a94267/",
    },
    {
      name: "Thomas Tanabe",
      linkedin: "www.linkedin.com/in/thomas-tanabe/",
    },
  ];

  const githubLink = "https://github.com/ReporteUrbano";

  return (
    <div className="container py-4">
      <h2 className="text-success text-center mb-4">Sobre o Projeto</h2>

      <p className="text-justify">
        Este aplicativo foi desenvolvido como parte de um projeto acadêmico no
        curso de Engenharia de Software da UNICESUMAR. Nosso objetivo é
        promover uma cidade mais segura e organizada, facilitando a comunicação
        entre os cidadãos e as autoridades públicas, através da denúncia de
        problemas urbanos.
      </p>

      <h4 className="mt-5">Equipe de Desenvolvimento</h4>
      <ul className="list-group mb-4">
        {teamMembers.map((member, index) => (
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {member.name}
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline-primary btn-sm"
            >
              <Linkedin /> LinkedIn
            </a>
          </li>
        ))}
      </ul>

      <h4>Repositório GitHub</h4>
      <a
        href={githubLink}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-dark mb-4"
      >
        <Github size={20} /> Ver Projeto no GitHub
      </a>

       <button
        className="btn btn-dark rounded-circle position-fixed"
        style={{
          bottom: "20px",
          left: "20px",
          width: "60px",
          height: "60px",
        }}
        onClick={() => navigate(-1)}
      >
        ←
      </button>


    </div>
  );
};

export default AboutUs;
