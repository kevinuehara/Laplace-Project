import { HTMLProps, PropsWithChildren, useCallback } from "react";

interface MicrophoneProps extends HTMLProps<HTMLButtonElement> {
  isDark: boolean;
  listening: boolean;
  stopByClick: () => void;
  startListen: () => void;
}

export const Microphone: React.FC<PropsWithChildren<MicrophoneProps>> = ({
  children,
  listening,
  stopByClick,
  startListen,
  isDark,
}: MicrophoneProps) => {
  const stopListening = useCallback(() => {
    if (listening) {
      stopByClick();
      return;
    }
    startListen();
  }, [listening, startListen, stopByClick]);
  return (
    <button
      onClick={stopListening}
      className={`${
        isDark
          ? "bg-white hover:bg-gray-200 text-black"
          : " bg-blue-500 hover:bg-blue-700 text=white"
      }  p-10 text-white text-2xl rounded-full ${
        listening ? "animate-pulse" : ""
      }`}
    >
      {children}
    </button>
  );
};
