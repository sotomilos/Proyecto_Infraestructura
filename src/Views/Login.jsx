import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LOCAL_USER = {
  usuario: 'admin',
  contraseña: '1234'
};

export default function Login({ onLogin }) {
  
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    if (usuario === LOCAL_USER.usuario && contraseña === LOCAL_USER.contraseña) {
      onLogin(LOCAL_USER);      
      navigate('/', { replace: true });
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <img src="/Logo_Castila.png" alt="Riopaila Castilla" className="logo"/>
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <img src="/Icono_User.png" alt="icono usuario" className="input-icon" />
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={e => setUsuario(e.target.value)}
            />
          </div>
          <div className="input-group">
            <img src="/Icono_Contra.png" alt="icono contraseña" className="input-icon" />
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={e => setContraseña(e.target.value)}
            />
          </div>
          {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
          <button type="submit" className="btn accept">Aceptar</button>
          <button type="button" className="btn cancel" onClick={() => {
            setUsuario('');
            setContraseña('');
            setError('');
          }}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}