"use client";

import { useState } from "react";
import "./style.css";
import { useAuth } from "../contexts/AuthProvider";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  // 🔹 Función para registrar nuevo usuario
  const register = async ({ name, email, password }) => {
    try {
      const res = await fetch("https://690b87c26ad3beba00f55bf7.mockapi.io/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          email,
          password,
          admin: false, // por defecto
        }),
      });

      if (!res.ok) throw new Error("Error al registrar usuario");

      alert("✅ Usuario registrado correctamente");
      setIsLogin(true); // vuelve al modo login
    } catch (err) {
      alert("❌ No se pudo registrar el usuario");
      console.error(err);
    }
  };

  // 🔹 Submit: login o registro
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      login({ email, password });
    } else {
      register({ name, email, password });
    }
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
                value={name}
                onChange={(e) => setName(e.target.value)}
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
