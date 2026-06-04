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
  /**
   * 라디오 버튼 우측에 표시될 라벨 텍스트입니다. (텍스트를 클릭해도 라디오가 선택됩니다.)
   */
  label?: string;

  /**
   * 에러 메시지 텍스트입니다. 값이 존재하면 라디오 버튼 테두리가 에러 스타일로 변경되며 하단에 메시지가 표시됩니다.
   */
  error?: string;
}

/**
 * 프로젝트 전반에서 사용하는 단일 라디오 버튼(Radio) 컴포넌트입니다.
 * 기본 HTML `<input type="radio">`의 속성을 상속받으며, `type` 속성은 제외됩니다.
 *
 * ### ✨ 주요 특징 및 사용 규칙
 * 1. **`name` 속성 필수**: 라디오 버튼은 상호 배타적(하나를 선택하면 다른 쪽이 해제)이어야 하므로, 하나의 그룹으로 묶일 라디오 컴포넌트들은 반드시 **동일한 `name` 속성**을 가져야 합니다.
 * 2. **제어 컴포넌트(Controlled) 권장**: 상태값 추적과 폼 제어를 위해 상위 컴포넌트단에서 `checked` 속성과 `onChange` 핸들러를 바인딩하여 사용하는 것을 적극 권장합니다.
 * 3. **CSS 기반 토글 구현**: 브라우저 기본 UI(`appearance-none`)를 제거하고 원형 테두리를 갖추었으며, 내부 input에 적용된 `peer` 클래스를 바탕으로 체크 시(`peer-checked`) 중앙 점(Dot)의 투명도가 부드럽게 활성화됩니다.
 * 4. **♿ 웹 접근성(Accessibility) 지원**: `useId`를 이용한 상호 연결 및 `aria-invalid`, `aria-describedby`를 표준 인터페이스로 바인딩하여 스크린 리더 환경에서도 올바르게 유효성 에러 상태를 감지할 수 있도록 보강했습니다.
 *
 * ### 🛠️ 가용 속성 (Props)
 * - `name` (`string`): 라디오 그룹을 식별할 공유 그룹 이름 (동일 그룹 내 필수 바인딩)
 * - `value` (`string | number`): 해당 라디오 선택 시 전달될 고유 데이터 값
 * - `label` (`string`): 우측 라벨 텍스트
 * - `error` (`string`): 유효성 에러 문구 (체크박스가 에러 테두리 스타일로 변함)
 * - `className` (`string`): `input` 엘리먼트에 추가적으로 주입하거나 오버라이딩할 커스텀 스타일 클래스
 * - `disabled` (`boolean`): 라디오 비활성화 여부 (라벨 컨테이너 영역의 커서 상태 및 불투명도도 일괄 동기화됨)
 *
 * @example
 * // 1. 리액트 상태와 연동하여 하나의 그룹으로 묶어 사용하는 전형적인 예시
 * const [gender, setGender] = useState("");
 * * <>
 * <Radio
 * name="gender-group"
 * value="male"
 * label="남성"
 * checked={gender === "male"}
 * onChange={(e) => setGender(e.target.value)}
 * />
 * <Radio
 * name="gender-group"
 * value="female"
 * label="여성"
 * checked={gender === "female"}
 * onChange={(e) => setGender(e.target.value)}
 * />
 * </>
 *
 * @example
 * // 2. 에러가 발생한 상황 예시
 * <Radio
 * name="terms"
 * value="agree"
 * label="개인정보 처리방침 동의"
 * error="선택 사항을 한 번 더 확인해주세요."
 * />
 */
const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, className, id: customId, ...props }, ref) => {
    const reactId = useId();
    const radioId = customId || reactId;
    const errorId = `${radioId}-error`;

    // Radio 버튼은 같은 name을 가진 그룹에서 하나만 선택될 수 있습니다.
    // checked와 onChange를 상위에서 제어하는 방식으로 사용합니다.
    // aria-invalid와 aria-describedby는 접근성에서 에러 상태를 알리는 용도입니다.

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
        "peer", // 인접 형제 요소인 dot 선택자 활성화를 위한 필수 클래스 주입
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
              상단 input에 peer 클래스가 정의되어 있으므로, 
              토큰 클래스 내의 peer-checked 선택자를 통해 순수 CSS 메커니즘으로 자동 가시화됩니다.
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
