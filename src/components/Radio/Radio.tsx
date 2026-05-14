import React, { forwardRef, useId } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { radioTokens } from "../../theme/token";

/**
 * RadioProps 인터페이스
 * input[type="radio"] 속성을 상속받습니다.
 * 라디오 버튼은 'name' 속성이 같아야 하나의 그룹으로 묶입니다.
 * 라디오 그룹 내에서는 하나의 옵션만 선택 가능합니다.
 */
interface RadioProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string; // 라디오 버튼 옆에 표시될 텍스트
  error?: string; // 에러 메시지
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, className, id: customId, ...props }, ref) => {
    const reactId = useId();
    const radioId = customId || reactId;
    const errorId = `${radioId}-error`;

    // 1. 라디오 버튼 본체 스타일
    // 체크박스와 달리 rounded-full(원형)이 특징입니다.
    // appearance-none을 사용하여 브라우저 기본 스타일을 제거합니다.
    // peer 클래스를 추가하여 CSS 인접 선택자를 활용할 수 있게 합니다.
    const radioClasses = twMerge(
      clsx(
        radioTokens.base,
        radioTokens.default,
        radioTokens.hoverFocus,
        radioTokens.disabled,
        error && radioTokens.error,
        className,
      ),
    );

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={radioId}
          className={clsx(
            radioTokens.labelWrapper,
            props.disabled && "cursor-not-allowed opacity-50",
          )}
        >
          {/* 라디오 버튼 컨테이너 */}
          <div className="relative flex items-center justify-center">
            <input
              type="radio"
              ref={ref}
              id={radioId}
              className={radioClasses}
              aria-invalid={error ? "true" : "false"} // 접근성: 에러 상태 표시
              aria-describedby={error ? errorId : undefined} // 접근성: 에러 메시지 연결
              {...props}
            />
            {/*
              2. 중앙 점(Dot): 라디오가 체크되었을 때 나타나는 작은 원
              input에 peer 클래스가 있으므로, peer-checked:opacity-100으로 자동 동작합니다.
              (JavaScript 조건 없이 CSS만으로 처리됨)
            */}
            <div className={radioTokens.dot} />
          </div>

          {/* 라벨 텍스트 */}
          {label && <span className={radioTokens.label}>{label}</span>}
        </label>

        {/* 에러 메시지 */}
        {error && (
          <p id={errorId} className={radioTokens.errorText}>
            {error}
          </p>
        )}
      </div>
    );
  },
);

Radio.displayName = "Radio";

export default Radio;
