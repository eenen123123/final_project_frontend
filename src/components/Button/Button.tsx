// src/components/Button/Button.tsx
import clsx from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";
import { buttonTokens } from "../../theme/token";

/**
 * ButtonProps 인터페이스
 * React 기본 버튼 속성을 모두 상속받고, 커스텀 디자인 속성을 추가합니다.
 * variant: 버튼의 디자인 테마를 선택할 수 있습니다. (primary, secondary, outline)
 *  - primary: 주요 버튼 
 *        # 의미: "이 페이지에서 사용자가 가장 먼저 해야 할 일"입니다.
          # 시각적 특징: 배경색이 꽉 차 있고 가장 눈에 띄는 색상(보통 브랜드 컬러)을 사용합니다.
          # 사용 예시: 로그인, 회원가입, 저장하기, 결제하기 등.
          # 규칙: 한 화면(또는 하나의 모달)에 딱 하나만 배치하는 것이 원칙입니다.
 *  - secondary: 보조 버튼
          # 의미: "Primary 버튼의 대안이거나, 중요도가 조금 낮은 작업"입니다.
          # 시각적 특징: Primary보다는 덜 튀는 색상(회색 계열이나 무채색)을 사용합니다. 
                      Primary와 나란히 있을 때 시선을 뺏지 않으면서도 버튼임을 알 수 있게 합니다.
          # 사용 예시: 취소, 뒤로 가기, 목록으로, 나중에 하기 등.
 *  - outline: 테두리만 있는 버튼
          # 의미: "보조 버튼(Secondary)과 비슷하지만, 배경색을 완전히 비워 시각적 무게감을 최소화한 버튼"입니다.
          # 시각적 특징: 배경 없이 테두리만 있으며, 마우스를 올렸을 때(Hover)만 배경색이 살짝 채워집니다.
          # 사용 예시:
            1) 중요도가 낮은 여러 개의 옵션을 나열할 때.
            2) 화려한 배경 이미지 위에 버튼을 올려야 할 때 (이미지를 가리지 않기 위해).
            3) '삭제'나 '로그아웃'처럼 주의가 필요하지만 Primary만큼 강조하고 싶지는 않을 때.
 * size: 버튼의 크기를 선택할 수 있습니다. (sm, md, lg)
 * isLoading: 버튼이 로딩 중인지 여부를 나타냅니다. true일 때는 클릭이 불가능하며, 로딩 스피너가 표시됩니다.
 * fullWidth: true로 설정하면 버튼이 부모 요소의 전체 너비를 차지합니다.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "success"; // 버튼 디자인 테마
  size?: "sm" | "md" | "lg"; // 버튼 크기
  isLoading?: boolean; // 로딩 상태 여부
  fullWidth?: boolean; // 너비 100% 여부
}

const Button = ({
  type = "button", // 기본값을 button으로 설정 (기본적으로 form 제출 버튼이 되지 않도록)
  children, // 버튼 내부에 들어갈 내용 (텍스트, 아이콘 등)
  variant = "primary", // 기본값: 파란색 테마
  size = "md", // 기본값: 중간 크기
  isLoading = false,
  fullWidth = false,
  className = "", // 외부에서 추가로 주입할 클래스
  disabled,
  ...props // 나머지 모든 표준 버튼 속성 (onClick 등)
}: ButtonProps) => {
  // 1. 모든 버튼에 공통으로 적용될 기본 스타일 (정렬, 둥근 모서리, 애니메이션 등)
  const baseClasses = buttonTokens.base;

  // 2. 테마별 스타일 정의
  const variantClasses = buttonTokens.variants;

  // 3. 크기별 스타일 정의 (패딩과 폰트 사이즈)
  const sizeClasses = buttonTokens.sizes;

  // 4. 조건부 클래스 처리 (전체 너비 여부)
  const widthClass = fullWidth ? "w-full" : "";

  // 5. 모든 클래스를 하나로 병합
  // tailwind-merge 활용 권장:
  // 외부에서 className을 통해 스타일을 덮어씌울 때, 가끔 Tailwind 클래스 간의 우선순위 충돌이 발생할 수 있습니다.
  // twMerge 함수를 쓰면 뒤에 들어온 클래스가 완벽하게 우선 적용됩니다.
  const combinedClasses = twMerge(
    clsx(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      widthClass,
      className,
    ),
  );

  // 6. 클릭 핸들러: 로딩 중이거나 비활성화 상태일 때 클릭 방지
  // 버튼이 로딩 중이거나 disabled 상태일 때는 클릭 이벤트가 발생하지 않도록 처리
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isLoading || disabled) {
      e.preventDefault();
      return;
    }
    props.onClick?.(e); // 로딩 중이 아닐 때만 원래의 onClick 실행
  };

  return (
    <button
      type={type}
      className={combinedClasses}
      disabled={isLoading || disabled}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        // 로딩 중일 때 보여줄 UI (스피너 + 텍스트)
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          로딩 중...
        </span>
      ) : (
        // 평상시 보여줄 내용
        children
      )}
    </button>
  );
};

export default Button;
