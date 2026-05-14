import React, { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { modalTokens } from "../../theme/token";

interface ModalProps {
  isOpen: boolean; // 모달이 열려있는지 여부
  onClose?: () => void; // 모달을 닫는 함수 (선택적)
  title?: string; // 모달 상단에 표시될 제목 (선택적)
  children: React.ReactNode; // 모달 본문에 들어갈 내용 (보통 Input 컴포넌트 등이 들어감)
  footer?: React.ReactNode; // 모달 하단에 표시될 내용 (보통 버튼이 들어감, 선택적)
  size?: "sm" | "md" | "lg"; // 모달 크기 (sm, md, lg 중 하나, 기본값: md)
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: ModalProps) => {
  // 모달이 열려 있는 동안 페이지 스크롤을 막습니다.
  // 모달을 닫으면 원래 페이지 스크롤 상태를 그대로 복원합니다.
  // Esc 키를 누르면 모달이 닫히도록 단축키를 적용합니다.
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const reactId = useId();
  const titleId = `${reactId}-modal-title`;

  if (!isOpen) return null;

  // 모달 사이즈 정의
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  // createPortal은 모달 콘텐츠를 현재 컴포넌트 트리와 별개로
  // DOM의 다른 위치에 렌더링할 때 사용합니다.
  // 이 방식은 모달이 부모 요소의 z-index나 overflow 설정에 영향을 받지 않게 해줍니다.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      {/* 1. Backdrop (배경 어둡게 처리) */}
      <div className={modalTokens.overlay} onClick={onClose} />

      {/* 2. Modal Content */}
      <div className={twMerge(clsx(modalTokens.panel, sizeClasses[size]))}>
        {/* Header */}
        {(title || onClose) && (
          <div className={modalTokens.header}>
            {title && (
              <h3 id={titleId} className={modalTokens.title}>
                {title}
              </h3>
            )}
            <button onClick={onClose} className={modalTokens.closeButton}>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Body (Input 컴포넌트 등이 들어갈 자리) */}
        <div className={modalTokens.body}>{children}</div>

        {/* Footer (Button 컴포넌트 배치) */}
        {footer && <div className={modalTokens.footer}>{footer}</div>}
      </div>
    </div>,
    // modal-root가 없으면 document.body로 fallback합니다.
    // 이 방식은 모달 컨테이너가 없는 템플릿에서도 오류를 피하고,
    // 최소한의 동작을 보장하기 위한 안전장치입니다.
    document.getElementById("modal-root") ?? document.body,
  );
};

export default Modal;
