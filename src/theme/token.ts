/**
 * 디자인 토큰 파일 (Design System)
 * ================================
 * 이 파일은 애플리케이션 전체에서 사용되는 Tailwind CSS 클래스들을 관리하는 중앙 저장소입니다.
 *
 * 계층 구조:
 * 1. 기본 토큰 (baseTokens): 색상, 타이포그래피, 스페이싱 등 가장 기본적인 디자인 값
 * 2. 공통 토큰 (commonTokens): 여러 컴포넌트에서 재사용되는 조합 스타일
 * 3. 컴포넌트 토큰 (*Tokens): 특정 컴포넌트에 맞춰진 스타일
 *
 * 이러한 계층 구조를 유지하면:
 * - 다크 모드 추가 시 baseTokens만 변경
 * - 브랜드 색상 변경 시 색상 팔레트만 수정
 * - 컴포넌트 재설계 시 해당 토큰만 갱신
 *
 * 사용 예시:
 * import { buttonTokens, inputTokens } from "../../theme/token";
 */

/**
 * 공통 토큰: 여러 컴포넌트에서 공통적으로 사용되는 스타일을 정의합니다.
 * 예를 들어, focus 스타일이나 라벨 텍스트 스타일 등은 여러 컴포넌트에서
 * 동일하게 사용될 수 있으므로, 공통 토큰으로 분리하여 관리합니다.
 * focusBlue: 파란색 포커스 스타일입니다. 인풋과 셀렉트에서 사용됩니다.
 * focusRed: 빨간색 포커스 스타일입니다. 인풋과 셀렉트에서 에러 상태일 때 사용됩니다.
 * labelText: 라벨 텍스트의 기본 스타일입니다. 모든 컴포넌트의 라벨에 적용됩니다.
 * helperTextInput: 인풋 컴포넌트의 하단 안내 문구 스타일입니다.
 * errorTextInput: 인풋 컴포넌트의 에러 메시지 스타일입니다.
 * helperTextCheckbox: 체크박스 컴포넌트의 하단 안내 문구 스타일입니다.
 * errorTextCheckbox: 체크박스 컴포넌트의 에러 메시지 스타일입니다.
 */
const commonTokens = {
  focusBlue: "focus:border-blue-600 focus:ring-4 focus:ring-blue-50",
  focusRed: "focus:border-red-500 focus:ring-4 focus:ring-red-100",
  labelText: "text-sm font-medium text-gray-700",
  helperTextInput: "text-sm text-gray-500 ml-1",
  errorTextInput: "text-sm text-red-600 ml-1 font-medium",
  helperTextCheckbox: "text-xs text-gray-500 ml-7",
  errorTextCheckbox: "text-xs text-red-600 ml-7 font-medium",
};

/**
 * 버튼 토큰: Button 컴포넌트에서 사용되는 스타일을 정의합니다.
 * base: 모든 버튼에 공통적으로 적용되는 스타일입니다.
 * variants: 버튼의 디자인 테마별 스타일입니다. (primary, secondary, outline, danger, success)
 * sizes: 버튼의 크기별 스타일입니다. (sm, md, lg)
 * 각 variant와 size는 Button 컴포넌트에서 props로 받아서 적용됩니다.
 */
export const buttonTokens = {
  base: "inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95",
  variants: {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 shadow-sm",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
  },
  sizes: {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  },
};

/**
 * 인풋 토큰: Input 컴포넌트에서 사용되는 스타일을 정의합니다.
 * base: 모든 인풋에 공통적으로 적용되는 스타일입니다.
 * normal: 기본 상태의 스타일입니다.
 * error: 에러 상태의 스타일입니다.
 * wrapper: 인풋과 라벨, 에러 메시지 등을 감싸는 컨테이너의 스타일입니다.
 * label: 라벨 텍스트의 스타일입니다.
 * helperText: 하단 안내 문구의 스타일입니다.
 * errorText: 에러 메시지의 스타일입니다.
 */
export const inputTokens = {
  base: "block px-4 py-2 text-base rounded-md border-2 transition-all outline-none disabled:opacity-50 disabled:bg-gray-50 disabled:pointer-events-none",
  normal:
    "border-gray-200 text-gray-900 placeholder-gray-400 " +
    commonTokens.focusBlue,
  error:
    "border-red-500 text-red-900 placeholder-red-300 " + commonTokens.focusRed,
  wrapper: "flex flex-col gap-1.5",
  label: commonTokens.labelText + " ml-1",
  helperText: commonTokens.helperTextInput,
  errorText: commonTokens.errorTextInput,
};

/**
 * 체크박스 토큰: Checkbox 컴포넌트에서 사용되는 스타일을 정의합니다.
 * base: 모든 체크박스에 공통적으로 적용되는 스타일입니다.
 * default: 기본 상태의 스타일입니다.
 * hoverFocus: 호버 및 포커스 시 적용되는 스타일입니다.
 * disabled: 비활성화 상태의 스타일입니다.
 * error: 에러 상태의 스타일입니다.
 * labelWrapper: 체크박스와 라벨을 감싸는 컨테이너의 스타일입니다.
 * label: 라벨 텍스트의 스타일입니다.
 * helperText: 하단 안내 문구의 스타일입니다.
 * errorText: 에러 메시지의 스타일입니다.
 * 체크박스는 appearance-none을 사용하여 브라우저 기본 스타일을 제거하고, 커스텀 스타일을 적용하는 방식입니다.
 * 체크 표시 아이콘은 input과 같은 부모 요소 안에 위치시키고, peer-checked 상태를 이용해 보이도록 설정합니다.
 */
export const checkboxTokens = {
  base: "h-5 w-5 cursor-pointer appearance-none rounded border-2 transition-all duration-200 flex items-center justify-center shrink-0",
  default:
    "border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600",
  hoverFocus:
    "focus:outline-none focus:ring-4 focus:ring-blue-50 hover:border-blue-400",
  disabled:
    "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-200",
  error: "border-red-500 hover:border-red-600 focus:ring-red-50",
  labelWrapper: "group flex cursor-pointer items-start gap-2.5 py-1",
  label: commonTokens.labelText + " select-none pt-0.5",
  helperText: commonTokens.helperTextCheckbox,
  errorText: commonTokens.errorTextCheckbox,
};

/**
 * 셀렉트 토큰: Select 컴포넌트에서 사용되는 스타일을 정의합니다.
 * triggerBase: 셀렉트 트리거 버튼에 공통적으로 적용되는 스타일입니다.
 * triggerStates: 트리거 버튼의 상태별 스타일입니다. (default, open, error)
 * disabled: 비활성화 상태의 스타일입니다.
 * label: 라벨 텍스트의 스타일입니다.
 * placeholder: 선택된 옵션이 없을 때 보여지는 플레이스홀더 텍스트의 스타일입니다.
 * listbox: 드롭다운 리스트의 컨테이너 스타일입니다.
 * option: 드롭다운 리스트의 각 옵션의 기본 스타일입니다.
 * selectedOption: 선택된 옵션의 스타일입니다.
 * optionHover: 옵션에 마우스를 올렸을 때의 스타일입니다.
 * errorText: 에러 메시지의 스타일입니다.
 * 셀렉트 컴포넌트는 트리거 버튼과 드롭다운 리스트로 구성되어 있습니다.
 * 트리거 버튼은 열림 상태와 에러 상태에 따라 스타일이 달라집니다.
 * 드롭다운 리스트는 옵션의 선택 여부와 호버 상태에 따라 스타일이 달라집니다.
 */
export const selectTokens = {
  triggerBase:
    "flex items-center justify-between px-4 py-2 text-base rounded-md border-2 transition-all outline-none bg-white " +
    commonTokens.focusBlue,
  triggerStates: {
    default: "border-gray-200 hover:border-gray-300",
    open: "border-blue-600 ring-4 ring-blue-50",
    error: "border-red-500",
  },
  disabled: "cursor-not-allowed bg-gray-50 opacity-50",
  label: commonTokens.labelText + " ml-1",
  placeholder: "text-gray-400",
  listbox:
    "absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 shadow-lg border border-gray-200 focus:outline-none sm:text-sm",
  option: "relative cursor-pointer select-none px-4 py-2 transition-colors",
  selectedOption: "bg-blue-50 text-blue-900 font-semibold",
  optionHover: "text-gray-900 hover:bg-gray-100",
  errorText: commonTokens.errorTextInput,
};

/**
 * 라디오 토큰: Radio 컴포넌트에서 사용되는 스타일을 정의합니다.
 * base: 모든 라디오 버튼에 공통적으로 적용되는 스타일입니다.
 * default: 기본 상태의 스타일입니다.
 * hoverFocus: 호버 및 포커스 시 적용되는 스타일입니다.
 * disabled: 비활성화 상태의 스타일입니다.
 * error: 에러 상태의 스타일입니다.
 * dot: 라디오 버튼이 선택되었을 때 나타나는 중앙 점의 스타일입니다.
 * labelWrapper: 라디오 버튼과 라벨을 감싸는 컨테이너의 스타일입니다.
 * label: 라벨 텍스트의 스타일입니다.
 * errorText: 에러 메시지의 스타일입니다.
 * 라디오 버튼은 체크박스와 유사하지만, 둥근 모양(rounded-full)이 특징입니다.
 * 라디오 그룹은 name 속성이 같은 라디오 버튼들로 구성되어, 하나만 선택 가능합니다.
 */
export const radioTokens = {
  base: "h-5 w-5 cursor-pointer appearance-none rounded-full border-2 transition-all duration-200 flex items-center justify-center shrink-0 peer",
  default:
    "border-gray-300 bg-white checked:border-blue-600 checked:bg-blue-600",
  hoverFocus:
    "focus:outline-none focus:ring-4 focus:ring-blue-50 hover:border-blue-400",
  disabled:
    "disabled:cursor-not-allowed disabled:bg-gray-100 disabled:border-gray-200",
  error: "border-red-500 hover:border-red-600 focus:ring-red-50",
  dot: "absolute h-2.5 w-2.5 rounded-full bg-blue-600 opacity-0 transition-opacity peer-checked:opacity-100",
  labelWrapper: "flex cursor-pointer items-center gap-2.5 py-1",
  label: commonTokens.labelText + " select-none",
  errorText: "text-xs text-red-600 ml-7 font-medium",
};

/**
 * 모달 토큰: Modal 컴포넌트에서 사용되는 스타일을 정의합니다.
 * overlay: 모달의 배경 오버레이 스타일입니다.
 * panel: 모달 콘텐츠 패널의 기본 스타일입니다.
 * header: 모달 헤더 영역의 스타일입니다.
 * title: 모달 제목 텍스트의 스타일입니다.
 * closeButton: 모달 닫기 버튼의 스타일입니다.
 * body: 모달 본문 영역의 스타일입니다.
 * footer: 모달 푸터 영역의 스타일입니다.
 * 모달 컴포넌트는 백드롭과 콘텐츠 패널로 구성되어 있습니다.
 * 백드롭은 화면 전체를 덮으며, 클릭 시 모달을 닫는 역할을 합니다.
 * 콘텐츠 패널은 중앙에 위치하며, 헤더, 본문, 푸터로 나뉘어 다양한 내용을 담을 수 있습니다.
 */
export const modalTokens = {
  overlay: "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity",
  panel:
    "relative w-full transform overflow-hidden rounded-lg bg-white shadow-2xl transition-all",
  header:
    "flex items-center justify-between border-b border-gray-100 px-6 py-4",
  title: "text-lg font-bold text-gray-900",
  closeButton: "text-gray-400 hover:text-gray-600 transition-colors",
  body: "px-6 py-6 text-gray-600 font-medium",
  footer:
    "flex justify-end gap-2 border-t border-gray-100 bg-gray-50 px-6 py-4",
};

/**
 * 카드 토큰: Card 컴포넌트에서 사용되는 스타일을 정의합니다.
 */
export const cardTokens = {
  base: "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm",
  header: "border-b border-gray-100 px-6 py-4",
  title: "text-lg font-bold text-gray-900",
  body: "p-6 text-gray-600",
  footer: "border-t border-gray-100 bg-gray-50 px-6 py-3",
};
