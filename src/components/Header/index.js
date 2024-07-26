import { useContext } from "react";
import Avatar from "../../assets/avatar.png";

import { AuthContext } from "../../contexts/auth";
import { Link } from "react-router-dom";

import { FiHome, FiUser, FiSettings } from "react-icons/fi";

import "./styles.css";

export function Header() {
  const { user } = useContext(AuthContext);
  return (
    <div className="sidebar">
      <div>
        <img
          src={user.avatarUrl === null ? Avatar : user.avatarUrl}
          alt="foto do usuario"
        />
      </div>
      <Link to={"/dashboard"}>
        <FiHome color="#fff" size={24} />
        Chamados
      </Link>
      <Link to={"/customers"}>
        <FiUser color="#fff" size={24} />
        Clientes
      </Link>
      <Link to={"/profile"}>
        <FiSettings color="#fff" size={24} />
        Pefil
      </Link>
    </div>
  );
}
