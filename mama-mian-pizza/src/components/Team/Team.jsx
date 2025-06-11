import React from 'react';
import './team.css';

const Team = () => {
  const teamMembers = [
    // Chicas primero (3)
    {
      name: "Katterin Yeferin Campos Rodriguez",
      role: "Project Manager",
      portfolio: "https://katterin-campos.github.io/portfolio", // Pendiente
      image: "https://media.licdn.com/dms/image/v2/D4D35AQFCbjhlH7qEog/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1714412876031?e=1750204800&v=beta&t=QIWMCCjfJXuerwU7mkZMUWQyPZJuG70H6eF_VkV-R8o"
    },
    {
      name: "Nathaly Milena Zelaya Caballero",
      role: "Diseñadora UX/UI",
      portfolio: "https://milena-uxui.com/",
      image: "https://media.licdn.com/dms/image/v2/D4E03AQGaitd0CDjFQg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1713838946553?e=1755129600&v=beta&t=bugHxkCzxfpMo93eIIJNZ0KFgZ1J4suS246d23OapFU"
    },
    {
      name: "Juan Carlos Martínez Torres",
      role: "Diseñador UX/UI",
      portfolio: "https://jeancodersv.netlify.app/",
      image: "https://jeancodersv.netlify.app/image/foto2.jpg"
    },
    // Chicos abajo (3)
    {
      name: "Franklin Stanley Larin Saravia",
      role: "Desarrollador Frontend",
      portfolio: "https://franklin-larin.netlify.app", // Pendiente
      image: "https://media.licdn.com/dms/image/v2/D5603AQHtOVdXamSeGg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1709504026689?e=1755129600&v=beta&t=plPL7tdFJ0WXPzWJaNA15GPZN1MCh3Bpq9eJ5hR1_B4"
    },
    {
      name: "Jose Alexander Salinas",
      role: "Desarrollador Frontend", 
      portfolio: "https://grand-cannoli-eea24c.netlify.app/#",
      image: "https://grand-cannoli-eea24c.netlify.app/img/imagen.jpeg"
    },
    {
      name: "Erick Mauricio Tiznado Rodriguez",
      role: "Desarrollador Backend",
      portfolio: "https://www.tiznadodev.com/",
      image: "https://media.licdn.com/dms/image/v2/D4D35AQFaMFDtsNIhrA/profile-framedphoto-shrink_800_800/profile-framedphoto-shrink_800_800/0/1709515078111?e=1750204800&v=beta&t=JFUHQaf9U9Xo88T1UHI8uUPSgaACNLjQDqTavEoyyO0"
    }
  ];

  const contactTeam = () => {
    window.location.href = "mailto:contacto.innovadev@gmail.com?subject=Contacto con el equipo de desarrollo&body=Hola equipo de desarrollo de Mamá Mia Pizza, me gustaría contactarlos...";
  };

  return (
    <div className="team-container">
      <h1>Acerca del Equipo de Desarrollo</h1>
      <p className="team-description">
        Conoce al talentoso equipo detrás de Mamá Mia Pizza, una plataforma de e-commerce 
        desarrollada con pasión y dedicación para brindarte la mejor experiencia culinaria.
      </p>
      
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div key={index} className="team-card">
            {member.image ? (
              <div className="member-photo">
                <img src={member.image} alt={member.name} />
              </div>
            ) : (
              <div className="member-avatar">
                {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
            )}
            <h3>{member.name}</h3>
            <p className="role">{member.role}</p>
            <a href={member.portfolio} target="_blank" rel="noopener noreferrer" className="portfolio-link">
              Ver Portafolio
            </a>
          </div>
        ))}
      </div>

      <div className="contact-section">
        <h2>¿Tienes alguna pregunta o sugerencia?</h2>
        <p>No dudes en contactarnos. Estamos aquí para ayudarte.</p>
        <button onClick={contactTeam} className="contact-team-btn">
          📧 Contactar al equipo
        </button>
      </div>
    </div>
  );
};

export default Team;