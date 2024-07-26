import "../SignIn/styles.css";
import "./singUp.css";

import logo from "../../assets/logo.png";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../contexts/auth";

import { ClipLoader } from "react-spinners";

export function SignUp() {
  const { SignUp, loadingAuth } = useContext(AuthContext);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignUp(event) {
    event.preventDefault();

    if (nome.trim() !== "" && email.trim() !== "" && password.trim() !== "") {
      await SignUp(nome, email, password);
      setEmail("");
      setNome("");
      setPassword("");
    }
  }

  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="logo" />
        </div>
        <form onSubmit={handleSignUp}>
          <input
            type="Nome"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="text"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="*******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">
            {loadingAuth ? (
              <div className="loading">
                <ClipLoader color="#fff" size={20} />
              </div>
            ) : (
              "Cadastrar"
            )}
          </button>
        </form>
        <Link to={"/"}>Já possue uma conta? faça login</Link>
      </div>
    </div>
  );
}
