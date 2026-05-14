import React, { forwardRef, useId } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { inputTokens } from "../../theme/token";

/**
 * InputProps 인터페이스
 * React 기본 input 속성을 상속받으며, UI 제어를 위한 속성을 추가합니다.
 */
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // 입력창 상단 라벨
  error?: string; // 에러 메시지 (있을 경우 입력창이 빨간색으로 변함)
  helperText?: string; // 하단 안내 문구
  fullWidth?: boolean; // 너비 100% 여부
}

// forwardRef를 사용하여 부모 컴포넌트가 input 엘리먼트에 직접 접근(ref)할 수 있게 합니다.
// 일반적인 컴포넌트는 내부의 DOM 엘리먼트에 ref를 직접 전달할 수 없습니다.
// 하지만 Input 컴포넌트는 로그인을 시도했을 때 아이디 창으로 포커스를 옮기는 등의 처리가 빈번하므로,
// forwardRef를 통해 부모가 input 태그를 직접 제어할 수 있게 열어주어야 합니다.
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label, // 라벨 텍스트
      error, // 에러 메시지 (있을 경우 입력창이 빨간색으로 변함)
      helperText, // 하단 안내 문구
      fullWidth = false, // 너비 100% 여부 (기본값: false)
      className, // 외부에서 추가로 주입할 클래스
      id: customId, // 외부에서 id를 주지 않아도 label-input 연결이 가능하도록 자동 생성
      ...props // 나머지 모든 표준 input 속성 (placeholder, type, value, onChange 등)
    },
    ref,
  ) => {
    // 1. 기본 입력창 스타일
    const baseInputClasses = inputTokens.base;

    // 2. 에러 발생 시 스타일
    const errorInputClasses = error ? inputTokens.error : inputTokens.normal;

    // 3. 외부에서 id를 주지 않아도 label-input 연결이 가능하도록 자동 생성
    const reactId = useId();
    const inputId = customId || reactId;

    // 4. 너비 및 커스텀 클래스 병합
    const inputClasses = twMerge(
      clsx(
        baseInputClasses,
        errorInputClasses,
        fullWidth ? "w-full" : "w-80",
        className,
      ),
    );

    return (
      <div
        className={clsx(inputTokens.wrapper, fullWidth ? "w-full" : "w-fit")}
      >
        {/* 라벨 영역 */}
        {label && (
          <label
            htmlFor={inputId} // 자동 생성된 ID 연결
            className={inputTokens.label}
          >
            {label}
          </label>
        )}

        {/* 입력창 영역 */}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          aria-invalid={error ? "true" : "false"} // 접근성 고려
          aria-describedby={error ? `${inputId}-error` : undefined} // 접근성 보강
          {...props}
        />

        {/* 안내 문구 및 에러 메시지 영역 */}
        {error ? (
          <p id={`${inputId}-error`} className={inputTokens.errorText}>
            {error}
          </p>
        ) : (
          helperText && <p className={inputTokens.helperText}>{helperText}</p>
        )}
      </div>
    );
  },
);

// 디버깅 시 컴포넌트 이름을 식별하기 위해 설정
Input.displayName = "Input";

export default Input;
