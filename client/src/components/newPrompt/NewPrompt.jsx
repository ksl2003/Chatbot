import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./newPrompt.css";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import Markdown from "react-markdown";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_PUBLIC_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const LoadingDots = () => (
  <div className="loading-dots">
    <span>.</span><span>.</span><span>.</span>
  </div>
);

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const queryClient = useQueryClient();
  const { getToken } = useAuth();
  const endRef = useRef(null);
  const formRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  const chat = model.startChat({
    history: data?.history?.map(({ role, parts }) => ({
      role,
      parts: [{ text: parts[0].text }],
    })),
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const token = getToken();
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}/update/`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", data._id] });
      formRef.current?.reset();
      setQuestion("");
      setAnswer("");
      setImg({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
      });
      setIsLoading(false);
      setErrorMsg("");
    },
    onError: (err) => {
      setIsLoading(false);
      setErrorMsg("Failed to save message. Please try again.");
      console.log(err);
    },
  });

  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);
    setIsLoading(true);
    setErrorMsg("");
    try {
      const result = await chat.sendMessageStream(text);
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }
      setIsLoading(false);
      mutation.mutate();
    } catch (err) {
      setIsLoading(false);
      setAnswer("");
      setErrorMsg("Sorry, I encountered an error. Please try again.");
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text) return;
    add(text, false);
  };

  // Handle Enter/Shift+Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) formRef.current.requestSubmit();
    }
  };

  // IN PRODUCTION WE DON'T NEED IT
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  if (!data || !data.history) {
    return null;
  }

  return (
    <>
      {/* ADD NEW CHAT */}
      {img.isLoading && <div className="">Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className="message user fade-in">{question}</div>}
      {isLoading && <LoadingDots />}
      {answer && !errorMsg && (
        <div className="message fade-in">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      {errorMsg && <div className="error-message fade-in">{errorMsg}</div>}
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input
          type="text"
          name="text"
          placeholder="Ask anything..."
          ref={inputRef}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          autoComplete="off"
        />
        <button type="submit" disabled={isLoading}>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
