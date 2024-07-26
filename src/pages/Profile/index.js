import { Header } from "../../components/Header";
import { Title } from "../../components/Title";
import "./styles.css";

import Avatar from "../../assets/avatar.png";

import { FiSettings, FiUpload } from "react-icons/fi";
import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { firestore, storage } from "../../services/firebaseConnection";
import { ClipLoader } from "react-spinners";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export function Profile() {
  const { user, storageUser, setUser, logout } = useContext(AuthContext);

  const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl);
  const [imageAvatar, setImageAvatar] = useState(null);
  const [nome, setNome] = useState(user && user.nome);
  const [email, setEmail] = useState(user && user.email);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (imageAvatar === null && nome !== "") {
      //atulizar apenas o nome do user
      const docRef = doc(firestore, "users", user.uid);

      await updateDoc(docRef, {
        nome: nome,
      }).then(() => {
        let data = {
          ...user,
          nome: nome,
        };
        setUser(data);
        storageUser(data);
        toast.success("Nome alterado com sucesso!");
        setLoading(false);
      });
    } else if (imageAvatar !== null && nome !== "") {
      //atualizar tanto o nome quanto a foto
      handleUpload();
    }
  }

  function handleUpload() {
    setLoading(true);
    const currentUid = user.uid;

    const uploadRef = ref(storage, `imagens/${currentUid}/${imageAvatar.name}`);

    const uploadTask = uploadBytes(uploadRef, imageAvatar).then((r) => {
      getDownloadURL(r.ref).then(async (imageInUrl) => {
        const docRef = doc(firestore, "users", user.uid);

        await updateDoc(docRef, {
          avatarUrl: imageInUrl,
          nome: nome,
        }).then(() => {
          let data = {
            ...user,
            nome: nome,
            avatarUrl: imageInUrl,
          };
          setUser(data);
          storageUser(data);
          toast.success("dados atualizados com sucesso!");
          setLoading(false);
        });
      });
    });
  }

  function handleFile(e) {
    console.log(e.target.files[0]);

    if (e.target.files[0]) {
      const image = e.target.files[0];

      if (image.type === "image/jpeg" || image.type === "image/png") {
        setImageAvatar(image);
        setAvatarUrl(URL.createObjectURL(image));
      } else {
        toast.error("envie uma imagem do tipo jpeg ou png");
        setImageAvatar(null);
      }
    }
  }

  return (
    <div>
      <Header />
      <div className="content">
        <Title name="minha conta">
          <FiSettings size={25} />
        </Title>

        <div className="container">
          <form className="form-profile" onSubmit={handleSubmit}>
            <label className="label-avatar">
              <span>
                <FiUpload color="#fff" size={25} />
              </span>
              <input type="file" accept="image/*" onChange={handleFile} />
              <br />
              {avatarUrl === null ? (
                <img
                  src={Avatar}
                  alt="foto de perfil"
                  width={250}
                  height={250}
                />
              ) : (
                <img
                  src={avatarUrl}
                  alt="foto de perfil"
                  width={250}
                  height={250}
                />
              )}
            </label>

            <label>Nome</label>
            <input
              type="text"
              placeholder={nome}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />

            <label>Email</label>
            <input type="text" placeholder={email} disabled />

            <button type="submit">
              {loading ? (
                <div className="loading">
                  <ClipLoader color="#fff" size={20} />
                </div>
              ) : (
                "Salvar"
              )}
            </button>
          </form>
        </div>
        <div className="container">
          <button
            className="logout-btn"
            onClick={() => {
              logout();
            }}
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
