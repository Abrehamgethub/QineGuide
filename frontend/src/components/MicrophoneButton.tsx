import { Mic, MicOff, Loader2 } from 'lucide-react';

interface MicrophoneButtonProps {
  isListening: boolean;
  isSupported: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const MicrophoneButton = ({
  isListening,
  isSupported,
  onClick,
  disabled = false,
}: MicrophoneButtonProps) => {
  if (!isSupported) {
    return (
      <button
        disabled
        className="rounded-full bg-gray-100 p-3 text-gray-400 cursor-not-allowed"
        title="Speech recognition is not supported in your browser"
      >
        <MicOff className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full p-3 transition-all ${
        isListening
          ? 'bg-red-500 text-white animate-pulse'
          : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      title={isListening ? 'Stop listening' : 'Start voice input'}
    >
      {isListening ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </button>
  );
};

export default MicrophoneButton;
