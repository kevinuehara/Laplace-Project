import { useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { OpenAIClass } from "./service/Openai";
import { Button } from "./components/Button";

function App() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState("");
  const [isDark, setIsDark] = useState(false);

  const commands = [
    {
      command: "apagar",
      callback: () => resetTranscript(),
    },
    {
      command: "escurecer",
      callback: () => setIsDark(true),
    },
    {
      command: "clarear",
      callback: () => setIsDark(false),
    },
  ];

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
  } = useSpeechRecognition({ commands });

  useEffect(() => {
    if (finalTranscript !== "") {
      console.log("Got final result:", finalTranscript);
    }
  }, [interimTranscript, finalTranscript]);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log(
      "Your browser does not support speech recognition software! Try Chrome desktop, maybe?"
    );
  }
  const listenContinuously = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "pt-BR",
    });

    setMessage(transcript);
  };

  const callOpenai = async () => {
    const response = await OpenAIClass.generateMessage(finalTranscript);
    console.log(response.message.content);
    setResult(
      response && response.message.content ? response.message.content : ""
    );
  };

  return (
    <main
      className={`${
        isDark
          ? `bg-gray-900 text-white transition ease-in`
          : "text-black bg-white transition ease-in"
      } h-screen w-screen`}
    >
      <div>
        <span className="text-x">Escutando: {listening ? "sim" : "não"}</span>
        <div>
          <Button onClick={listenContinuously} label="Escutar" />
          <Button onClick={callOpenai} label="Parar" />
        </div>
      </div>
      <div>{message}</div>
      <div>
        <span className="text-xl">{transcript}</span>
        <div dangerouslySetInnerHTML={{ __html: result }}></div>
      </div>
    </main>
  );
}

export default App;
