import { useState, createContext, useEffect } from "react";
import { auth, firestore } from "../services/firebaseConnection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  async function signIn(email, password) {
    setLoadingAuth(true);

    await signInWithEmailAndPassword(auth, email, password)
      .then(async (r) => {
        let uid = r.user.uid;

        const docRef = doc(firestore, "users", uid);
        const docSnap = await getDoc(docRef);

        let data = {
          uid: uid,
          nome: docSnap.data().nome,
          email: r.user.email,
          avatarUrl: docSnap.data().avatarUrl,
        };

        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
        toast.success(`Olá novamente, ${data.nome}!`);
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log("erro ao logar", err);
        setLoadingAuth(false);
        toast.error("ops, algo deu errado ...");
      });
  }

  async function SignUp(nome, email, password) {
    setLoadingAuth(true);

    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (r) => {
        let uid = r.user.uid;

        await setDoc(doc(firestore, "users", uid), {
          nome: nome,
          avatarUrl: null,
        })
          .then(() => {
            let data = {
              uid: uid,
              nome: nome,
              email: r.user.email,
              avatarUrl: null,
            };

            setUser(data);
            storageUser(data);
            setLoadingAuth(false);
            toast.success(`Seja bem vindo(a), ${data.nome}!`);
            navigate("/dashboard");
          })
          .catch((err) => {
            console.log("erro ao cadastrar no banco de dados", err);
            setLoadingAuth(false);
            toast.error("ops, algo deu errado ...");
          });
      })
      .catch((err) => {
        console.log("erro ao cadastrar", err);
        setLoadingAuth(false);
        toast.warn("ops, algo deu errado ...");
      });
  }

  function storageUser(data) {
    localStorage.setItem("@tickets", JSON.stringify(data));
  }

  async function logout() {
    await signOut(auth);
    localStorage.removeItem("@tickets");
    setUser(null);
  }

  useEffect(() => {
    async function loadingUser() {
      const storageUser = localStorage.getItem("@tickets");

      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }

      setLoading(false);
    }

    loadingUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        signIn,
        SignUp,
        loadingAuth,
        loading,
        logout,
        storageUser,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
