# 🛠️ Design System & UI Components Review (2026-05-14)

## 🎨 Design Tokens (`token.ts`)

프로젝트의 시각적 언어를 정의하는 핵심 파일입니다.

- **Common**: `focusRing`, `transition`, `disabled` 스타일 등 공통 인터랙션 정의.
- **Component Specific**: 각 컴포넌트(`button`, `input`, `modal`, `card`, `badge`)의 상태별(Variant, Size) 클래스 셋을 객체 형태로 관리하여 유지보수성 극대화.

## 📦 Component Library 명세

### 1. Action & Interaction

- **Button**: `primary`, `secondary`, `outline`, `ghost`, `danger`의 5가지 테마와 로딩 상태(`isLoading`)를 지원합니다.
- **Badge**: 정보를 분류하기 위한 캡슐형 UI로, 텍스트 가독성을 위해 배경색과 글자색의 대비를 토큰으로 최적화했습니다.

### 2. Form Elements (Input & Selection)

- **Input**: 텍스트 입력창으로, 에러 상태 시 시각적 피드백(`border-red-500`)과 안내 문구 영역을 통합했습니다.
- **Select**: 커스텀 드롭다운입니다. `useRef`와 `mousedown` 이벤트를 바인딩하여 외부 클릭 시 닫히는 기능을 완벽히 구현했습니다.
- **Checkbox & Radio**: 브라우저 기본 UI를 `appearance-none`으로 제거하고, SVG와 점(Dot)을 이용해 디자인 시스템에 맞는 커스텀 UI를 입혔습니다. `forwardRef`로 외부 폼 라이브러리와의 호환성을 확보했습니다.

### 3. Layout & Overlays

- **Card**: 합성 컴포넌트(Compound Component) 패턴을 적용했습니다. `Card.Header`, `Card.Body`, `Card.Footer`로 나누어 유연한 배치가 가능합니다.
- **Modal**: 리액트 포털(`createPortal`) 기술을 사용하여 레이어 간섭을 최소화하고, 열림 상태에 따라 본문 스크롤을 제어합니다.

## 🛠️ 핵심 기술 스택

- **React**: Functional Components, Hooks (`useId`, `useRef`, `useEffect`).
- **Tailwind CSS**: 유틸리티 우선 스타일링.
- **Libraries**: `clsx`, `tailwind-merge` (안전한 클래스 병합).
- **TypeScript**: 엄격한 Props 인터페이스 정의.

## 🚩 다음 권장 작업

- [ ] **Toast System**: 전역 상태를 활용한 알림 메시지 구현.
- [ ] **Accessibility**: 스크린 리더를 위한 ARIA 속성 보완 (Select, Radio 등).
- [ ] **Form Integration**: `react-hook-form` 등과 연동한 실전 페이지 구축.
