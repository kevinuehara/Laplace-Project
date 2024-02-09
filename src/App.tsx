import { useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { OpenAIClass } from "./service/Openai";
import { Microphone } from "./components/Microphone";
import { Command } from "./types";

function App() {
  const [result, setResult] = useState("");
  const [isDark, setIsDark] = useState(false);

  const stopListen = () => {
    SpeechRecognition.stopListening();
    resetTranscript();
    setResult("");
  };

  const commands = [
    {
      command: Command.APAGAR,
      callback: () => resetTranscript(),
    },
    {
      command: Command.ESCURECER,
      callback: () => setIsDark(true),
    },
    {
      command: Command.CLAREAR,
      callback: () => setIsDark(false),
    },
    {
      command: Command.PARAR_OURVIR,
      callback: () => stopListen(),
    },
    {
      command: Command.TERMINEI,
      callback: async () => await callOpenai(),
    },
  ];

  const { transcript, finalTranscript, resetTranscript, listening } =
    useSpeechRecognition({ commands });

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
  };

  const callOpenai = async () => {
    const response = await OpenAIClass.generateMessage(finalTranscript);
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
      } h-screen w-screen relative`}
    >
      <div className="flex flex-col relative h-1/4 bg-purple-700 w-screen">
        <div className="absolute left-[38%] md:left-[42%] top-10">
          <h1 className="text-4xl text-white">Laplace</h1>
        </div>
        <div className="absolute top-36 left-[35%] md:left-[42%]">
          <Microphone
            isDark={isDark}
            listening={listening}
            stopByClick={() => SpeechRecognition.stopListening()}
            startListen={() => listenContinuously()}
          >
            <FaMicrophone
              className={`${isDark ? "text-black" : "text-white"} text-4xl`}
            />
          </Microphone>
        </div>
      </div>

      <div className="mt-20">
        {transcript && listening && (
          <>
            <div>
              <span className="text-xl font-semibold">Transcrição</span>
              <div className="border-blue-300 border p-3">
                <span className="text-xl">{transcript}</span>
              </div>
            </div>

            <div
              className={`${
                result && listening ? "border-red-300 border" : ""
              } mt-5`}
            >
              <span className="text-xl font-semibold">Resultado</span>
              <div
                className="p-3"
                dangerouslySetInnerHTML={{ __html: result }}
              ></div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default App;
