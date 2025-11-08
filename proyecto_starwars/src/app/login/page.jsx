"use client";

import { useState } from "react";
import "./style.css";
import { useAuth } from "../contexts/AuthProvider";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="tab-selector">
          <button
            className={`tab-btn ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Iniciar sesión
          </button>
          <button
            className={`tab-btn ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Crear cuenta
          </button>
          <div className={`tab-indicator ${!isLogin ? "right" : ""}`} />
        </div>

        <h1 className="auth-title">
          {isLogin ? "Bienvenido/a" : "Unite a la galaxia"}
        </h1>
        <p className="auth-subtitle">
          {isLogin
            ? "Ingresá tus credenciales para continuar"
            : "Completá tus datos para crear tu cuenta"}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Username</label>
              <input
                type="text"
                id="name"
                className="form-input"
                placeholder="Luke Skywalker"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="tucuenta@galaxia.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="••••••••"
              required
            />
          </div>

          {isLogin && (
            <div className="form-footer">
              <label className="checkbox-label">
                <input type="checkbox" /> Recordarme
              </label>
            
            </div>
          )}

          <button type="submit" className="auth-btn">
            {isLogin ? "Ingresar" : "Registrarme"}
          </button>

          <p className="toggle-text">
            {isLogin ? "¿No tenés cuenta?" : "¿Ya tenés una cuenta?"}{" "}
            <button
              type="button"
              className="toggle-link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Registrate" : "Iniciá sesión"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
