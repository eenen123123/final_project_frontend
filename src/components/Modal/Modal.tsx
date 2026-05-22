import React, { useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { modalTokens } from "../../theme/token";

interface ModalProps {
  /**
   * 모달의 개방/폐쇄 상태를 제어하는 트리거 플래그입니다. `true`일 때 화면에 렌더링됩니다. (필수)
   */
  isOpen: boolean;

  /**
   * 배경(Overlay)을 클릭하거나 우측 상단 닫기(X) 버튼을 눌렀을 때 실행되는 상위 상태 제어 콜백 함수입니다.
   */
  onClose?: () => void;

  /**
   * 모달 상단 영역(Header)에 표시될 메인 제목 텍스트입니다. 생략할 경우 타이틀 렌더링 영역이 패싱됩니다.
   */
  title?: string;

  /**
   * 모달의 중심 본문(Body) 영역에 탑재할 콘텐츠 노드입니다. 주로 정보 입력용 `Input`, `Select` 등이 배치됩니다. (필수)
   */
  children: React.ReactNode;

  /**
   * 모달 최하단(Footer) 영역에 배치될 콘텐츠 노드입니다. 주로 메인 액션 및 취소 `Button` 세트를 전달합니다.
   */
  footer?: React.ReactNode;

  /**
   * 모달 패널 컨테이너의 가로 최대 너비(`max-w`) 스펙을 결정합니다.
   * - `"sm"`: 최대 너비 `max-w-md` (간단한 알림, 확인창 권장)
   * - `"md"`: 최대 너비 `max-w-lg` (일반적인 폼 입력, 데이터 조회 권장)
   * - `"lg"`: 최대 너비 `max-w-2xl` (상세 명세표, 다단 레이아웃 콘텐츠 권장)
   * @default "md"
   */
  size?: "sm" | "md" | "lg";
}

/**
 * 사용자 화면 최상위에 오버레이 레이어를 구성하여 포커스를 독점하고, 컨텍스트를 유지한 채 액션을 유도하는 대화상자(Modal) 컴포넌트입니다.
 *
 * ### ✨ 주요 특징 및 내장 메커니즘
 * 1. **⚙️ 독립적 DOM 포털 렌더링 (`createPortal`)**: 부모 레이아웃의 `z-index`나 `overflow: hidden` 스타일 제약으로부터 격리되도록 `id="modal-root"` 엘리먼트(또는 `body`) 하단으로 마운트 위치를 강제 변환합니다.
 * 2. **🔒 백드롭 스크롤 락 (Scroll Lock)**: 모달이 활성화된 기간 동안 배경 도큐먼트 바디의 스크롤을 `hidden`으로 동적 고정하며, 닫힐 때 이전 스크롤 무드를 부드럽게 복원합니다.
 * 3. **⌨️ 단축키 및 바깥 영역 폐쇄 (Escape / Click Outside)**: 사용자가 키보드 `Escape` 키를 누르거나 어두운 배경(Backdrop Overlay) 영역을 클릭하면 안전하게 `onClose` 핸들러가 트리거됩니다.
 * 4. **♿ 웹 접근성(Accessibility) 보강**: `role="dialog"`, `aria-modal="true"` 스펙을 충족하고 `useId`를 이용해 모달 타이틀과 상호 인터랙션 앵커(`aria-labelledby`)를 자동 바인딩합니다.
 *
 * ### 🛠️ 가용 속성 (Props)
 * - `isOpen` (`boolean`): 활성화 플래그 (필수)
 * - `onClose` (`() => void`): 폐쇄 이벤트 핸들러
 * - `title` (`string`): 상단 타이틀 명세
 * - `children` (`ReactNode`): 본문 바디 삽입 요소 (필수)
 * - `footer` (`ReactNode`): 하단 버튼 바 삽입 요소
 * - `size` (`"sm" | "md" | "lg"`): 가로 최대폭 규격 (기본값: `"md"`)
 *
 * @example
 * // 회원 탈퇴 확인을 위한 소형(sm) 모달 가이드
 * const [isExitOpen, setIsExitOpen] = useState(false);
 * * <Modal
 * isOpen={isExitOpen}
 * onClose={() => setIsExitOpen(false)}
 * title="회원 탈퇴 안내"
 * size="sm"
 * footer={
 * <div className="flex gap-2 w-full justify-end">
 * <Button variant="secondary" onClick={() => setIsExitOpen(false)}>취소</Button>
 * <Button variant="danger" onClick={handleDeleteAccount}>탈퇴하기</Button>
 * </div>
 * }
 * >
 * <p className="text-gray-600">정말로 탈퇴하시겠습니까? 작성하신 모든 데이터는 복구되지 않습니다.</p>
 * </Modal>
 */
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
