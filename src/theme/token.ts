/**
 * 디자인 토큰 파일 (Design System)
 * ================================
 * 이 파일은 애플리케이션 전체에서 사용되는 Tailwind CSS 클래스를
 * 중앙에서 관리하는 역할을 합니다.
 *
 * 핵심 개념:
 * 1. 공통 스타일은 한번만 정의하고 재사용합니다.
 * 2. 컴포넌트별 토큰은 해당 컴포넌트에 필요한 스타일 조합만 담당합니다.
 * 3. 스타일 변경이 필요할 때는 컴포넌트 내부가 아닌 토큰 파일만 수정합니다.
 *
 * 일반적인 사용 흐름:
 * import { inputTokens } from "../../theme/token";
 * <input className={`${inputTokens.base} ${inputTokens.normal}`} />
 *
 * 이 구조는 작은 라이브러리뿐 아니라 중간 규모 UI 시스템에서도 유지보수가 쉽습니다.
 */

/**
 * 공통 토큰: 여러 컴포넌트에서 재사용되는 스타일 조각을 모아둡니다.
 * 주로 텍스트, 포커스, 에러 메시지처럼 여러 컴포넌트가 동일하게 쓰는 스타일입니다.
 *
 * 이 객체는 직접 렌더링되는 클래스가 아니라,
 * 다른 컴포넌트 토큰에서 조합해서 사용하는 용도로 설계되었습니다.
 */
const commonTokens = {
  // 포커스가 활성화되었을 때 사용하는 공통 스타일
  focusBlue: "focus:border-blue-600 focus:ring-4 focus:ring-blue-50",
  focusRed: "focus:border-red-500 focus:ring-4 focus:ring-red-100",

  // 라벨 텍스트 기본 스타일
  labelText: "text-sm font-medium text-gray-700",

  // 안내 및 에러 문구 스타일
  helperTextInput: "text-sm text-gray-500 ml-1",
  errorTextInput: "text-sm text-red-600 ml-1 font-medium",
  helperTextCheckbox: "text-xs text-gray-500 ml-7",
  errorTextCheckbox: "text-xs text-red-600 ml-7 font-medium",
};

/**
 * 버튼 토큰: Button 컴포넌트에서 사용하는 스타일입니다.
 * Button 컴포넌트는 이 토큰을 가져와서 variant와 size에 따라 조합합니다.
 *
 * base: 버튼 공통 규칙을 담고 있습니다.
 * variants: 버튼의 색상, 테두리, hover 상태를 정의합니다.
 * sizes: 버튼 패딩과 텍스트 크기를 정의합니다.
 */
export const buttonTokens = {
  base: "inline-flex items-center justify-center rounded-md font-medium transition-all focus:outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-95",
  variants: {
    // 추천 순서: primary > secondary > outline > danger > success
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
 * 인풋 토큰: Input 컴포넌트에서 사용하는 스타일입니다.
 * Input 컴포넌트는 label, 입력 박스, helper/error 텍스트를 구성합니다.
 *
 * base: 모든 입력창에 공통으로 쓰이는 기본 스타일
 * normal: 정상 상태에서의 테두리 및 텍스트 색상
 * error: 에러 상태에서의 테두리 및 텍스트 색상
 * wrapper: 인풋 전체 레이아웃 컨테이너
 * label: 상단 라벨의 스타일
 * helperText / errorText: 하단 안내 문구 및 에러 문구 스타일
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
 * 체크박스 토큰: Checkbox 컴포넌트에서 사용하는 스타일을 정의합니다.
 * Checkbox는 appearance-none을 사용해 브라우저 기본 체크박스 스타일을 제거하고,
 * 커스텀 박스와 SVG 체크 아이콘을 조합하여 구현합니다.
 * base: 체크박스 본체의 기본 스타일 (크기, 모양, 애니메이션 등)
 * default: 정상 상태에서의 테두리 및 배경색
 * hoverFocus: 호버 및 포커스 상태에서의 스타일
 * disabled: 비활성화 상태에서의 스타일
 * error: 에러 상태에서의 스타일
 * labelWrapper: 체크박스와 라벨을 감싸는 컨테이너 스타일
 * label: 라벨 텍스트 스타일
 * helperText / errorText: 하단 안내 문구 및 에러 문구 스타일
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
 * 셀렉트 토큰: Select 컴포넌트에서 사용하는 스타일을 정의합니다.
 *
 * Select는 버튼 형태의 트리거와 옵션 리스트(listbox)를 조합한 UI입니다.
 * 트리거는 상태에 따라 border, ring, 색상이 달라지며,
 * listbox는 드롭다운 메뉴의 룩앤필을 담당합니다.
 * triggerBase: 트리거 버튼의 기본 스타일 (정렬, 패딩, 폰트, 테두리, 배경 등)
 * triggerStates: 트리거의 상태별 스타일 (기본, 열림, 에러)
 * disabled: 트리거가 비활성화되었을 때의 스타일
 * label: 셀렉트 라벨 스타일
 * placeholder: 선택된 옵션이 없을 때 보여줄 텍스트 스타일
 * listbox: 드롭다운 메뉴의 스타일
 * option: 각 옵션 항목의 기본 스타일
 * selectedOption: 선택된 옵션의 스타일
 * optionHover: 옵션에 마우스를 올렸을 때의 스타일
 * errorText: 에러 메시지 스타일
 */
export const selectTokens = {
  // 버튼 형태의 기본 트리거 스타일
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
 * 라디오 토큰: Radio 컴포넌트에서 사용하는 스타일을 정의합니다.
 *
 * Radio는 체크박스와 비슷하게 구현되지만,
 * 둥근 외형과 중앙 점 표시가 주요 차이점입니다.
 * base: 라디오 버튼의 기본 스타일 (크기, 모양, 애니메이션 등)
 * default: 정상 상태에서의 테두리 및 배경색
 * hoverFocus: 호버 및 포커스 상태에서의 스타일
 * disabled: 비활성화 상태에서의 스타일
 * error: 에러 상태에서의 스타일
 * dot: 라디오가 선택되었을 때 중앙에 나타나는 작은 원의 스타일
 * labelWrapper: 라디오 버튼과 라벨을 감싸는 컨테이너 스타일
 * label: 라벨 텍스트 스타일
 * errorText: 에러 메시지 스타일
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
 * 모달 토큰: Modal 컴포넌트에서 사용하는 스타일을 정의합니다.
 *
 * overlay: 모달 뒤에 깔리는 반투명 배경
 * panel: 모달 콘텐츠를 담는 카드 같은 박스
 * header / title / closeButton: 모달 상단 바
 * body: 모달 본문 영역
 * footer: 하단 버튼이나 액션 영역
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
 * 카드 토큰: Card 컴포넌트에서 사용하는 스타일을 정의합니다.
 *
 * Card는 정보를 영역별로 묶어주는 컨테이너입니다.
 * base: 카드 자체의 기본 배경, 경계, 그림자 등을 정의합니다.
 * header: 카드 상단 제목 영역
 * title: 헤더 제목 텍스트
 * body: 카드 본문 영역
 * footer: 카드 하단 액션 영역
 */
export const cardTokens = {
  base: "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm",
  header: "border-b border-gray-100 px-6 py-4",
  title: "text-lg font-bold text-gray-900",
  body: "p-6 text-gray-600",
  footer: "border-t border-gray-100 bg-gray-50 px-6 py-3",
};

/**
 * 배지 토큰: Badge 컴포넌트에서 사용되는 스타일을 정의합니다.
 *
 * Badge는 상태, 카테고리, 태그 등을 짧은 텍스트로 표시하는 작은 레이블입니다.
 * 주로 리스트 아이템, 카드, 또는 네비게이션에서 상태 정보를 표시할 때 사용됩니다.
 *
 * base: 모든 배지에 공통으로 적용되는 스타일
 *   - inline-flex: 인라인 요소처럼 동작하면서 flexbox 레이아웃 지원
 *   - rounded-full: 완전한 원형 모양 (padding에 따라 타원 모양)
 *   - text-xs: 매우 작은 텍스트 크기 (12px)
 *   - font-bold: 강조된 텍스트 무게
 *
 * variants: 배지의 색상 테마별 스타일
 *   - primary: 파란색 (주요 정보, 기본값)
 *   - secondary: 회색 (보조 정보)
 *   - danger: 빨간색 (경고, 에러, 부정적 상태)
 *   - success: 초록색 (성공, 승인, 긍정적 상태)
 *   - outline: 테두리 스타일 (밝은 배경이 필요한 경우)
 *
 * dotColors: dot 속성이 true일 때 variant별로 사용할 점의 색상
 *   - 각 variant의 텍스트 색상과 동일하게 설정되어 시각적 일관성 유지
 */
export const badgeTokens = {
  base: "inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors",
  variants: {
    primary: "bg-blue-100 text-blue-700",
    secondary: "bg-gray-100 text-gray-700",
    danger: "bg-red-100 text-red-700",
    success: "bg-green-100 text-green-700",
    outline: "border border-gray-300 text-gray-600 bg-white",
  },
  dotColors: {
    primary: "bg-blue-500",
    secondary: "bg-gray-500",
    danger: "bg-red-500",
    success: "bg-green-500",
    outline: "bg-gray-400",
  },
};
