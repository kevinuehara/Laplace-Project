import { useMemo, useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { OpenAIClass } from "./service/Openai";
import { Microphone } from "./components/Microphone";
import { Select } from "./components/Select";
import { CommandEnUs, CommandPtBr } from "./types";

const langsAvailable = [
  { label: "pt-br", value: "pt-br" },
  { label: "en-us", value: "en-us" },
];

function App() {
  const [result, setResult] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [lang, setLang] = useState("pt-br");

  const stopListen = () => {
    SpeechRecognition.stopListening();
    resetTranscript();
    setResult("");
  };

  const Command = useMemo(() => {
    return lang === "pt-br" ? CommandPtBr : CommandEnUs;
  }, [lang]);

  const commands = [
    {
      command: Command.CLEAR,
      callback: () => resetTranscript(),
    },
    {
      command: Command.DARKER,
      callback: () => setIsDark(true),
    },
    {
      command: Command.LIGHT,
      callback: () => setIsDark(false),
    },
    {
      command: Command.STOP_LISTENING,
      callback: () => stopListen(),
    },
    {
      command: Command.FINISHED,
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
      language: lang,
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
        <Select
          items={langsAvailable}
          isDark={isDark}
          label="Language"
          onChange={(e) => setLang(e.currentTarget.value)}
        />
        <div className="absolute left-[36%] md:left-[43%] top-10">
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
