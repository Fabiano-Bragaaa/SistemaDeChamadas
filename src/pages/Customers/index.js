import { FiUser } from "react-icons/fi";
import { Header } from "../../components/Header";
import { Title } from "../../components/Title";
import { useState } from "react";
import { firestore } from "../../services/firebaseConnection";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";

export function Customers() {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    if (nome !== "" && cnpj !== "" && endereco !== "") {
      await addDoc(collection(firestore, "customers"), {
        nomeFantasia: nome,
        cnpj,
        endereco,
      })
        .then(() => {
          setNome("");
          setEndereco("");
          setCnpj("");
          toast.success("empresa cadastrada com sucesso!");
        })
        .catch((err) => {
          console.log("deu um erro!", err);
          toast.error("erro ao fazer o cadastro!");
        });
    } else {
      toast.error("preencha todos os campos");
    }
  }
  return (
    <div>
      <Header />

      <div className="content">
        <Title name={"clientes"}>
          <FiUser size={25} />
        </Title>
        <div className="container">
          <form className="form-profile" onSubmit={handleRegister}>
            <label>Nome Fantasia</label>
            <input
              type="text"
              placeholder="nome da empresa"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <label>CNPJ</label>
            <input
              type="text"
              placeholder="digite o seu CNPJ"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
            />
            <label>Endereço da empresa</label>
            <input
              type="text"
              placeholder="endereço da empresa"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
            />
            <button type="submit">Salvar</button>
          </form>
        </div>
      </div>
    </div>
  );
}
