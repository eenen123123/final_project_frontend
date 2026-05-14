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
  // 모달이 열려있을 때 스크롤을 막고, Esc 키로 닫을 수 있도록 처리합니다.
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

  // 모달 코드에서 가장 생소할 수 있는 부분이 바로 createPortal입니다.
  // 개념: 컴포넌트를 DOM 트리의 다른 위치로 "순간 이동"시키는 기능입니다.
  // 왜 쓰나요?: 리액트 앱은 보통 id="root"인 div 안에 모든 것을 그립니다.
  //    하지만 모달이 부모 요소의 z-index나 overflow: hidden 스타일의 영향을 받으면 화면에 제대로 안 보일 수 있습니다.
  //    이를 방지하기 위해 body 직속의 modal-root로 렌더링 위치를 옮기는 것입니다.
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
    // modal-root가 없을 경우 기본적으로 body에 포털을 렌더링하여 런타임 에러를 방지합니다.
    // 대부분의 HTML 템플릿에서 modal-root를 추가하는 것이 좋지만,
    // 없을 때도 최소한 모달이 정상 표시되도록 안전하게 처리합니다.
    document.getElementById("modal-root") ?? document.body,
  );
};

export default Modal;
