import React, { forwardRef, useId } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { checkboxTokens } from "../../theme/token";

/**
 * CheckboxProps 인터페이스
 * 기본 input[type="checkbox"] 속성을 상속받습니다.
 */
interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string; // 체크박스 옆에 표시될 텍스트
  error?: string; // 에러 메시지
  helperText?: string; // 하단 안내 문구
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, className, id: customId, ...props }, ref) => {
    const reactId = useId();
    const checkboxId = customId || reactId;

    // 1. 체크박스 본체 스타일
    // appearance-none을 사용하여 브라우저 기본 스타일을 제거하는 것이 커스텀의 시작입니다.
    const checkboxClasses = twMerge(
      clsx(
        checkboxTokens.base,
        checkboxTokens.default,
        checkboxTokens.hoverFocus,
        checkboxTokens.disabled,
        error && checkboxTokens.error,
        "peer",
        className,
      ),
    );

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={checkboxId}
          className={clsx(
            checkboxTokens.labelWrapper,
            props.disabled && "cursor-not-allowed opacity-50",
          )}
        >
          {/* 체크박스 컨테이너: 체크 시 아이콘을 넣기 위해 relative를 사용하거나 
              CSS 가상 요소(after/before) 대신 SVG를 직접 활용하는 방식입니다. */}
          <div className="relative flex items-center justify-center">
            <input
              type="checkbox"
              ref={ref}
              id={checkboxId}
              className={checkboxClasses}
              {...props}
            />
            {/*
              체크 표시 아이콘: input과 svg는 같은 부모 안에 있어야 합니다.
              input에는 peer 클래스가 붙어 있고, svg는 peer-checked 상태를 이용해 보이게 됩니다.
            */}
            <svg
              className="absolute h-3.5 w-3.5 pointer-events-none text-white opacity-0 transition-opacity peer-checked:opacity-100"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="4"
              // Tailwind의 peer 기능을 활용하기 위해 input에 'peer' 클래스를 추가하면 더 깔끔합니다.
              // 여기서는 가시성을 위해 CSS 선택자 대신 논리적인 배치를 사용했습니다.
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* 라벨 텍스트 */}
          {label && <span className={checkboxTokens.label}>{label}</span>}
        </label>

        {/* 에러 및 도움말 문구 */}
        {error ? (
          <p className={checkboxTokens.errorText}>{error}</p>
        ) : (
          helperText && (
            <p className={checkboxTokens.helperText}>{helperText}</p>
          )
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
