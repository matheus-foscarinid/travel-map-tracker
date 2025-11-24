import { useState, useRef } from 'react';
import html2canvas, { type Options } from 'html2canvas';
import { Download, Loader2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';

interface CaptureButtonProps {
  /** ID ou ref do elemento a ser capturado. Se não fornecido, captura o body inteiro */
  targetId?: string;
  /** Nome do arquivo para download (sem extensão) */
  filename?: string;
  /** Opções customizadas para html2canvas */
  canvasOptions?: Options;
  /** Classe CSS adicional para o botão */
  className?: string;
  /** Texto do botão */
  label?: string;
  /** Mostrar ícone */
  showIcon?: boolean;
}

export default function CaptureButton({
  targetId,
  filename = 'capture',
  canvasOptions,
  className = '',
  label = 'Download PNG',
  showIcon = true
}: CaptureButtonProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const { currentTheme } = useTheme();
  const { showError } = useToast();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleCapture = async () => {
    try {
      setIsCapturing(true);

      // Encontrar o elemento alvo
      let element: HTMLElement | null = null;

      if (targetId) {
        element = document.getElementById(targetId);
        if (!element) {
          console.error(`Elemento com ID "${targetId}" não encontrado`);
          showError(`Elemento com ID "${targetId}" não encontrado`);
          setIsCapturing(false);
          return;
        }
      } else {
        // Se não houver targetId, captura o body
        element = document.body;
      }

      const defaultOptions: Partial<Options> = {
        useCORS: true,
        allowTaint: false,
        backgroundColor: currentTheme.colors.background || '#ffffff',
        scale: 2,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        foreignObjectRendering: true,
        removeContainer: false,
        imageTimeout: 0,
        ignoreElements: (element: Element) => {
          if (buttonRef.current && element === buttonRef.current) {
            return true;
          }
          return false;
        },
        ...canvasOptions
      };

      const canvas = await html2canvas(element, defaultOptions);

      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Erro ao criar blob da imagem');
          showError('Erro ao capturar a imagem. Por favor, tente novamente.');
          setIsCapturing(false);
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${filename}.png`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        setIsCapturing(false);
      }, 'image/png');
    } catch (error) {
      console.error('Erro ao capturar imagem:', error);
      showError('Erro ao capturar a imagem. Por favor, tente novamente.');
      setIsCapturing(false);
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleCapture}
      disabled={isCapturing}
      className={`
        flex items-center justify-center gap-2
        px-4 py-2 rounded-lg
        font-medium text-sm
        transition-all duration-200
        shadow-sm hover:shadow-md
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      style={{
        backgroundColor: isCapturing
          ? currentTheme.colors.textMuted
          : currentTheme.colors.primary,
        color: '#ffffff',
        border: 'none'
      }}
      onMouseEnter={(e) => {
        if (!isCapturing) {
          e.currentTarget.style.backgroundColor = currentTheme.colors.primaryHover || currentTheme.colors.primary;
        }
      }}
      onMouseLeave={(e) => {
        if (!isCapturing) {
          e.currentTarget.style.backgroundColor = currentTheme.colors.primary;
        }
      }}
    >
      {isCapturing ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Capturando...</span>
        </>
      ) : (
        <>
          {showIcon && <Download className="w-4 h-4" />}
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
