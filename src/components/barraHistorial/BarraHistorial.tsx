import React, { useEffect, useState } from "react";
import { ChatItem } from "../paginaPrincipal/ChatPrincipal";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";
import { Link, useParams } from "react-router-dom";

type Params = {
    id: string;
};

const BarraHistorial = () => {
    const params = useParams<Params>();
    const [chatID, setChatID] = useState<ChatItem>();
    const [elementosFirebase, setElementosFirebase] = useState<ChatItem[]>([]);
    const chatGptCollection = collection(db, "chat");

    const traerElementos = () => {
        getDocs(chatGptCollection)
            .then((data) => {
                console.log("DATA RESULT : ", data);
                const values = data.docs.map((doc) => ({
                    ...(doc.data() as ChatItem),
                    id: doc.id,
                }));
                setElementosFirebase(values);
            })
            .catch((error) => {
                console.log("ERROR: ", error);
            });
    };
    useEffect(() => {
        traerElementos();
    }, []);

    const traerConversacionId = async () => {
        try {
            const llamarElemento = doc(
                collection(db, "chat"),
                params.id
            ); /* Es mejor usar params, para 
            definir el valor,useParams en React Redux es un hook proporcionado por la biblioteca React
            Router que te permite acceder a los parámetros de la URL definidos en tus rutas*/
            const elementoLlamado = await getDoc(llamarElemento);

            const valorDelLlamdo = elementoLlamado.data() as ChatItem;
            setChatID(valorDelLlamdo);
            console.log("esto es lo que tiene el elemento: ", chatID);
        } catch {}
    };
    useEffect(() => {
        traerConversacionId();
    }, []);

    return (
        <div>
            {chatID ? (
                <div className="contenedorChat">
                    <div className="barraGuardado">
                        <Link to={"/"} className="logoChat">
                            <img
                                src="https://1000marcas.net/wp-content/uploads/2023/02/ChatGPT-Logo.png"
                                alt=""
                            />

                            <h4>JeroGPT</h4>
                        </Link>

                        <div>
                            <hr />
                            {elementosFirebase.map((object) => (
                                <div>
                                    <Link
                                        to={"/barraHistorial/" + object.id}
                                        style={{
                                            textDecoration: "none",
                                        }} /*+ historial.map((item)=>(
                                    item.id
                                ))} */
                                    >
                                        <h1 className="textoHistorial">
                                            {object.pregunta}
                                        </h1>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="chatPrincipal">
                        <div className="contenedorTexto">
                            <div
                                style={{
                                    display: "flex",
                                    color: "white",
                                    flexDirection: "column",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "7px",
                                    }}
                                >
                                    <img
                                        src="https://static.vecteezy.com/system/resources/previews/005/005/788/original/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg"
                                        alt=""
                                    />
                                    <h4>{chatID.pregunta}</h4>
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "7px",
                                    }}
                                >
                                    <img
                                        src="https://static.vecteezy.com/system/resources/previews/021/608/795/original/chatgpt-logo-chat-gpt-icon-on-green-background-free-vector.jpg"
                                        alt=""
                                    />
                                    <h4>{chatID.respuesta}</h4>
                                </div>
                            </div>
                        </div>

                        {/* <div className="contenedorInput">
                        <input
                            type="text"
                            value={textoPregunta}
                            onChange={(e) => {
                                setTextoPregunta(e.target.value);
                            }}
                            onKeyUp={(e) => {
                                if (e.key === "Enter") {
                                    enviarMensajeAOpenIa();
                                }
                            }}
                            placeholder="Message ChatGPT…"
                        />
                        <button
                            className="btnEnviar"
                            onClick={async () => {
                                await enviarMensajeAOpenIa();
                                guardadoEnFirebase();
                            }}
                        >
                            <span>
                                <FontAwesomeIcon icon={faArrowUp} />
                            </span>
                        </button>
                    </div> */}
                    </div>
                </div>
            ) : (
                <h1>No se encontro elemento que coincida con el id</h1>
            )}
        </div>
    );
};

export default BarraHistorial;
