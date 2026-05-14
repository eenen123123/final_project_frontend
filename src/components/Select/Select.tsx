import { useState, useRef, useEffect, useId, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";
import { selectTokens } from "../../theme/token";

/**
 * SelectOption 인터페이스
 * 각 옵션의 값(value)과 화면에 보여줄 이름(label)을 정의합니다.
 */
interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps {
  label?: string; // 셀렉트 상단 라벨
  options: SelectOption[]; // 선택 가능한 옵션 목록
  value?: string | number; // 현재 선택된 옵션의 값
  onChange: (value: string | number) => void; // 옵션이 선택될 때 호출되는 콜백 함수
  placeholder?: string; // 선택된 옵션이 없을 때 보여줄 플레이스홀더 텍스트
  error?: string; // 에러 메시지 (있을 경우 셀렉트가 빨간색으로 변함)
  fullWidth?: boolean; // 너비 100% 여부
  disabled?: boolean; // 셀렉트 비활성화 여부
}

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

  // 2. 외부 영역 클릭 시 드롭다운 닫기 로직 (핵심)
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

  const selectedIndex = useMemo(
    () => options.findIndex((opt) => opt.value === value),
    [value, options],
  );

  const openSelect = () => {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setIsOpen(true);
  };

  // activeIndex는 사용자가 드롭다운에서 키보드로 이동 중인 하이라이트된 옵션 인덱스입니다.
  // 실제 선택된 값은 value prop으로 관리됩니다.
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
