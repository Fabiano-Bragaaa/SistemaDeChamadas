import "./styles.css";
import "../SignUp/singUp.css";

import logo from "../../assets/logo.png";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../../contexts/auth";
import { ClipLoader } from "react-spinners";

export function SignIn() {
  const { signIn, loadingAuth } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSignIn(event) {
    event.preventDefault();

    if (email.trim() !== "" && password.trim() !== "") {
      await signIn(email, password);
      setEmail("");
      setPassword("");
    }
  }
  return (
    <div className="container-center">
      <div className="login">
        <div className="login-area">
          <img src={logo} alt="logo" />
        </div>
        <form onSubmit={handleSignIn}>
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
        <Link to={"/signUp"}>Criar uma conta</Link>
      </div>
    </div>
  );
}
