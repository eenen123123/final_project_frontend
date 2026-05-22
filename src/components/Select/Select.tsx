import { useState, useRef, useEffect, useId, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { selectTokens } from "../../theme/token";

/**
 * SelectOption 인터페이스
 * 각 옵션의 실제 데이터 값(value)과 화면에 렌더링될 텍스트(label)를 정의합니다.
 */
interface SelectOption {
  /**
   * 각 옵션의 고유 식별 값 (형태: 문자열 또는 숫자)
   */
  value: string | number;

  /**
   * 화면에 노출할 친절한 이름
   */
  label: string;
}

interface SelectProps {
  /**
   * 셀렉트 박스 상단에 표시될 라벨 텍스트입니다.
   */
  label?: string;

  /**
   * 드롭다운 리스트에 렌더링될 옵션 목록 배열입니다. (필수)
   */
  options: SelectOption[];

  /**
   * 현재 선택된 옵션의 값(`value`)입니다. 부모 컴포넌트의 상태값과 매핑됩니다.
   */
  value?: string | number;

  /**
   * 새로운 옵션이 선택되었을 때 실행되는 콜백 함수입니다. 선택된 옵션의 `value`를 인자로 넘겨줍니다. (필수)
   */
  onChange: (value: string | number) => void;

  /**
   * 선택된 옵션이 없을 때 초기값으로 보여줄 안내 문구입니다.
   */
  placeholder?: string;

  /**
   * 에러 메시지 텍스트입니다. 값이 존재하면 셀렉트 박스 테두리가 에러 스타일로 변경되며 하단에 메시지가 노출됩니다.
   */
  error?: string;

  /**
   * `true`일 경우 셀렉트 박스 너비가 부모 요소의 전체 너비(`w-full`)를 차지합니다. 기본값은 고정 너비(`w-80`)입니다.
   */
  fullWidth?: boolean;

  /**
   * `true`일 경우 셀렉트가 비활성화되며, 마우스 클릭 및 키보드 조작이 차단됩니다.
   */
  disabled?: boolean;
}

/**
 * 프로젝트 전반에서 사용하는 커스텀 드롭다운 선택(Select) 컴포넌트입니다.
 * 비표준 UI 환경에서도 완벽한 사용자 경험과 접근성을 제공하도록 고안되었습니다.
 *
 * ### ✨ 주요 특징
 * 1. **⌨️ 표준 키보드 인터랙션 내장**:
 * - `ArrowUp / ArrowDown`: 드롭다운을 열거나 하이라이트된 옵션을 위아래로 탐색합니다.
 * - `Enter / Space`: 하이라이트된 옵션을 실제로 선택하거나 드롭다운을 토글합니다.
 * - `Escape`: 드롭다운을 즉시 닫고 원래 포커스를 트리거 버튼으로 복구시킵니다.
 * 2. **🖱️ 바깥 영역 클릭 감지 (Click Outside)**: 드롭다운이 열려 있을 때 화면의 빈 곳을 누르면 자동으로 안전하게 드롭다운이 닫힙니다.
 * 3. **♿ 웹 접근성(WAI-ARIA) 만족**: `role="listbox"`, `role="option"`, `aria-expanded`, `aria-activedescendant` 등의 웹 표준 속성을 완벽히 추적하여 스크린 리더 환경을 지원합니다.
 *
 * ### 🛠️ 가용 속성 (Props)
 * - `options` (`SelectOption[]`): `{ value, label }` 형태의 데이터 배열
 * - `value` (`string | number`): 현재 바인딩된 상태 값
 * - `onChange` (`(val) => void`): 값이 바뀔 때 부모로직을 실행할 이벤트 핸들러
 * - `label` / `placeholder` / `error`: 폼 레이아웃 구성을 위한 텍스트 속성들
 * - `fullWidth` / `disabled`: 레이아웃 및 제어 속성
 *
 * @example
 * // 1. 리액트 상태와 연동한 기본 사용 예시
 * const [fruit, setFruit] = useState<string | number>("");
 * const fruitOptions = [
 * { value: "apple", label: "사과" },
 * { value: "banana", label: "바나나" }
 * ];
 * * <Select
 * label="과일 선택"
 * options={fruitOptions}
 * value={fruit}
 * onChange={setFruit}
 * />
 */
const Select = ({
  label,
  options,
  value,
  onChange,
  placeholder = "선택해주세요",
  error,
  fullWidth = false,
  disabled = false,
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false); // 드롭다운 열림 상태
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null); // 바깥 클릭 감지를 위한 ref
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reactId = useId();

  const listboxId = `${reactId}-listbox`;
  const errorId = `${reactId}-error`;

  // 1. 선택된 옵션의 label 찾기
  const selectedOption = options.find((opt) => opt.value === value);

  // 2. 외부 영역 클릭 시 드롭다운 닫기 로직
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // 선택된 옵션의 인덱스를 메모화하여 value나 옵션 목록이 바뀔 때만 재계산합니다.
  const selectedIndex = useMemo(
    () => options.findIndex((opt) => opt.value === value),
    [value, options],
  );

  const openSelect = () => {
    // 드롭다운을 여는 순간, 선택된 옵션을 하이라이트로 맞춥니다.
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  };

  // activeIndex는 사용자가 드롭다운을 키보드로 탐색할 때 바뀝니다.
  // 실제 선택된 값은 value prop으로 관리되고, UI에는 selectedOption.label이 표시됩니다.
  const closeSelect = () => {
    setIsOpen(false);
  };

  const handleSelectOption = (selectedValue: string | number) => {
    onChange(selectedValue);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (disabled) return;

    const selectedIndex = options.findIndex((opt) => opt.value === value);

    // 화살표 키로 옵션을 탐색합니다. 드롭다운이 닫힌 상태면 열리고,
    // 열린 상태에서는 현재 하이라이트된 옵션을 위/아래로 이동합니다.
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();

      if (!isOpen) {
        openSelect();
        setActiveIndex(
          selectedIndex >= 0
            ? selectedIndex
            : event.key === "ArrowUp"
              ? options.length - 1
              : 0,
        );
        return;
      }

      setActiveIndex((current) => {
        if (current < 0) {
          return selectedIndex >= 0 ? selectedIndex : 0;
        }

        if (event.key === "ArrowUp") {
          return current === 0 ? options.length - 1 : current - 1;
        }

        return current === options.length - 1 ? 0 : current + 1;
      });
    }

    // Enter/Space: 드롭다운이 열려 있으면 선택, 아니면 열기/닫기.
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen && activeIndex >= 0) {
        handleSelectOption(options[activeIndex].value);
        return;
      }
      setIsOpen((current) => !current);
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      closeSelect();
      triggerRef.current?.focus();
    }
  };

  // 3. 스타일 정의
  const triggerClasses = twMerge(
    clsx(
      selectTokens.triggerBase,
      selectTokens.triggerStates[error ? "error" : isOpen ? "open" : "default"],
      fullWidth ? "w-full" : "w-80",
      disabled && selectTokens.disabled,
    ),
  );

  return (
    <div
      ref={containerRef}
      className={clsx("flex flex-col gap-1.5", fullWidth ? "w-full" : "w-fit")}
    >
      {/* 라벨 영역 */}
      {label && (
        <label htmlFor={reactId} className={selectTokens.label}>
          {label}
        </label>
      )}

      <div className="relative">
        {/* 셀렉트 트리거 버튼 */}
        <button
          id={reactId}
          ref={triggerRef}
          type="button"
          disabled={disabled}
          onClick={() => {
            if (isOpen) {
              closeSelect();
            } else {
              openSelect();
            }
          }}
          onKeyDown={handleTriggerKeyDown}
          className={triggerClasses}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-activedescendant={
            activeIndex >= 0
              ? `${reactId}-option-${options[activeIndex]?.value}`
              : undefined
          }
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        >
          <span className={clsx(!selectedOption && selectTokens.placeholder)}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {/* 화살표 아이콘: 열림 상태에 따라 회전 */}
          <svg
            className={clsx(
              "h-5 w-5 text-gray-400 transition-transform",
              isOpen && "rotate-180",
            )}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* 옵션 리스트 (애니메이션 처리가 가능하도록 조건부 렌더링) */}
        {isOpen && (
          <ul
            id={listboxId}
            className={selectTokens.listbox}
            role="listbox"
            tabIndex={-1}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                id={`${reactId}-option-${option.value}`}
                className={clsx(
                  selectTokens.option,
                  index === activeIndex && "bg-blue-100",
                  option.value === value
                    ? selectTokens.selectedOption
                    : selectTokens.optionHover,
                )}
                role="option"
                aria-selected={option.value === value}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => handleSelectOption(option.value)}
                tabIndex={-1}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* 에러 메시지 */}
      {error && (
        <p id={errorId} className={selectTokens.errorText}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
