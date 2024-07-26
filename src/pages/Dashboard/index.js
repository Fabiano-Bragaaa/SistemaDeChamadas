import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";

import { Header } from "../../components/Header";
import { Title } from "../../components/Title";
import { FiPlus, FiMessageSquare, FiSearch, FiEdit2 } from "react-icons/fi";

import { Link } from "react-router-dom";

import "./dashboard.css";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
} from "firebase/firestore";
import { firestore } from "../../services/firebaseConnection";

import { format } from "date-fns";
import { ClipLoader } from "react-spinners";
import { Modal } from "../../components/Modal";

const listRef = collection(firestore, "chamados");

export function Dashboard() {
  const { logout } = useContext(AuthContext);

  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEmpity, setIsEmpity] = useState(false);
  const [lastDocs, setLetDocs] = useState();
  const [loadingMore, setLoadingMore] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [datails, setDetails] = useState();

  async function updateState(querySnapshot) {
    const isCollection = querySnapshot.size === 0;

    if (!isCollection) {
      let lista = [];

      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          createdFormat: format(doc.data().created.toDate(), "dd/MM/yyyy"),
          status: doc.data().status,
          complemento: doc.data().complemento,
        });
      });

      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]; // pegando o ultimo item
      setLetDocs(lastDoc);
      setChamados((chamados) => [...chamados, ...lista]);
    } else {
      setIsEmpity(true);
    }

    setLoadingMore(false);
  }

  function toggleModal(item) {
    setShowModal(!showModal);
    setDetails(item);
  }

  async function handleMore() {
    setLoadingMore(true);

    const q = query(
      listRef,
      orderBy("created", "desc"),
      startAfter(lastDocs),
      limit(5)
    );

    const querySnapshot = await getDocs(q);
    await updateState(querySnapshot);
  }

  useEffect(() => {
    async function loadingChamados() {
      const q = query(listRef, orderBy("created", "desc"), limit(5));

      const querySnapshot = await getDocs(q);
      setChamados([]);
      await updateState(querySnapshot);

      setLoading(false);
    }

    loadingChamados();

    return () => {};
  }, []);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="content">
          <Title name="Tickets">
            <FiMessageSquare size={25} />
          </Title>
          <div className="container dashboard">
            <div className="loading">
              <ClipLoader color="#000" size={20} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />

      <div className="content">
        <Title name="Tickets">
          <FiMessageSquare size={25} />
        </Title>

        <>
          {chamados.length === 0 ? (
            <div className="container dashboard">
              <span> Nenhum chamado encontrado</span>
              <Link to="/new" className="new">
                <FiPlus color="#FFF" size={25} />
                Novo chamado
              </Link>
            </div>
          ) : (
            <>
              <Link to="/new" className="new">
                <FiPlus color="#FFF" size={25} />
                Novo chamado
              </Link>

              <table>
                <thead>
                  <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">Assunto</th>
                    <th scope="col">Status</th>
                    <th scope="col">Cadastrando em</th>
                    <th scope="col">#</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.map((r, index) => {
                    return (
                      <tr key={index}>
                        <td data-label="Cliente">{r.cliente}</td>
                        <td data-label="Assunto">{r.assunto}</td>
                        <td data-label="Status">
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                r.status === "Aberto" ? "#5cb85c" : "#999",
                            }}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td data-label="Cadastrado">{r.createdFormat}</td>
                        <td data-label="#">
                          <button
                            className="action"
                            style={{ backgroundColor: "#3583f6" }}
                            onClick={() => toggleModal(r)}
                          >
                            <FiSearch color="#FFF" size={17} />
                          </button>
                          <Link
                            to={`/new/${r.id}`}
                            className="action"
                            style={{ backgroundColor: "#f6a935" }}
                          >
                            <FiEdit2 color="#FFF" size={17} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <button onClick={handleMore} className="btn-more">
                {loadingMore ? (
                  <div className="loading">
                    <ClipLoader color="#fff" size={20} />
                  </div>
                ) : (
                  "Buscar mais"
                )}
              </button>
            </>
          )}
        </>
      </div>
      {showModal && (
        <Modal conteudo={datails} close={() => setShowModal(!showModal)} />
      )}
    </div>
  );
}
