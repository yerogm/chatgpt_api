import React, { useEffect, useState } from "react";
import "./styles.scss";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OpenAI from "openai";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig/firebase";

interface ChatItem {
    pregunta: string;
    respuesta: string;
}

const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true,
});
// eslint-disable-next-line react-hooks/rules-of-hooks

const ChatPrincipal = () => {
    const [textoPregunta, setTextoPregunta] = useState("");
    const [historial, setHistorial] = useState<ChatItem[]>([]);
    const [mensajeGuardado, setMensajeGuardado] = useState<ChatItem | null>(
        null
    );
    const [elementosFirebase, setElementosFirebase] = useState<ChatItem[]>([]);
    const chatGptCollection = collection(db, "chat");

    const enviarMensajeAOpenIa = async () => {
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: textoPregunta,
                    },
                ],
                temperature: 1,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            const choices = response.choices ?? [];
            if (choices.length > 0) {
                let respuestaObj = choices[0];
                const contenido = respuestaObj.message.content;
                const chatItem: ChatItem = {
                    pregunta: textoPregunta,
                    respuesta: contenido ?? "---",
                };
                setHistorial([...historial, chatItem]);
                setMensajeGuardado(chatItem);
                setTextoPregunta("");
            }
        } catch (e) {
            console.log(e);
        }
    };
    const guardadoEnFirebase = async () => {
        if (mensajeGuardado) {
            await addDoc(chatGptCollection, mensajeGuardado);
        }
        traerElementos();
    };

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

    return (
        <div className="contenedorChat">
            <div className="barraGuardado">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <img
                        src="https://1000marcas.net/wp-content/uploads/2023/02/ChatGPT-Logo.png"
                        alt=""
                    />
                    <h4>JeroGPT</h4>
                </div>
                <div>
                    <hr />
                    {elementosFirebase.map((object) => (
                        <h1 className="textoHistorial">{object.pregunta}</h1>
                    ))}
                </div>
            </div>
            <div className="chatPrincipal">
                {elementosFirebase.map((item) => {
                    return (
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
                                    <h4>{item.pregunta}</h4>
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
                                    <h4>{item.respuesta}</h4>
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div className="contenedorInput">
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
                </div>
            </div>
        </div>
    );
};

export default ChatPrincipal;
