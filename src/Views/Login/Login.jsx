// Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import './Login.css';

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await login({ usuario, contraseña });
      if (response?.data?.usuario) {
        const userData = response.data.usuario;
        localStorage.setItem('usuario', JSON.stringify(userData));
        onLogin(userData);
        navigate(userData.rol === 'admin' ? '/admin' : '/dashboard', { replace: true });
      } else {
        setError('Respuesta del servidor inválida');
      }
    } catch (err) {
      setError(err.message || 'Error al intentar iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUsuario('');
    setContraseña('');
    setError('');
  };

  return (
    <div className="container">
      <div className="login-box">
        <img
          src="/Logo_Castila.png"
          alt="Riopaila Castilla"
          className="logo"
        />
        <h2>Iniciar sesión</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="text"
              placeholder="Usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="btn-group">
            <button type="submit" className="btn accept" disabled={isLoading}>
              {isLoading ? 'Cargando...' : 'Aceptar'}
            </button>
            <button
              type="button"
              className="btn cancel"
              onClick={handleReset}
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
