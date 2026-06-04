# 공통 컴포넌트 사용 가이드

> 이 문서는 `src/components` 하위의 공통 컴포넌트 사용 방법을 정리한 가이드입니다.
> 각 컴포넌트는 Tailwind CSS 기반의 디자인 토큰(`src/theme/token`)으로 스타일이 관리됩니다.

---

## 목차

- [Badge](#badge)
- [Button](#button)
- [Card](#card)
- [Checkbox](#checkbox)
- [Input](#input)
- [Modal](#modal)
- [Radio](#radio)
- [Select](#select)

---

## Badge

상태, 카테고리, 태그 등을 짧은 텍스트로 표시하는 작은 레이블 컴포넌트입니다.

### Props

| Prop        | 타입                                                  | 기본값      | 설명                                        |
| ----------- | ----------------------------------------------------- | ----------- | ------------------------------------------- |
| `children`  | `React.ReactNode`                                     | (필수)      | 배지 안에 표시할 내용                       |
| `variant`   | `"primary" \| "secondary" \| "danger" \| "success" \| "outline"` | `"primary"` | 배지 색상 테마                  |
| `dot`       | `boolean`                                             | `false`     | 배지 왼쪽에 상태 점(dot) 표시 여부          |
| `className` | `string`                                              | —           | 추가 Tailwind 클래스                        |
| `ariaLabel` | `string`                                              | —           | 스크린 리더용 설명 텍스트                   |

### variant 종류

| variant     | 색상     | 사용 상황                         |
| ----------- | -------- | --------------------------------- |
| `primary`   | 파란색   | 주요 정보, 기본 태그              |
| `secondary` | 회색     | 보조 정보                         |
| `danger`    | 빨간색   | 경고, 에러, 거절 상태             |
| `success`   | 초록색   | 성공, 승인, 완료 상태             |
| `outline`   | 테두리만 | 밝은 배경에서 가볍게 표시할 때    |

### 사용 예시

```tsx
import Badge from "@/components/Badge/Badge";

// 기본
<Badge>New</Badge>

// 색상 테마
<Badge variant="success">승인됨</Badge>
<Badge variant="danger">거절됨</Badge>
<Badge variant="outline">태그</Badge>

// 상태 점 표시 (온라인/오프라인 등)
<Badge dot variant="success">온라인</Badge>
<Badge dot variant="danger">오프라인</Badge>

// 접근성 텍스트 추가
<Badge ariaLabel="사용자 상태: 인증됨" variant="primary">✓ 인증</Badge>
```

---

## Button

클릭 가능한 액션을 수행하는 버튼 컴포넌트입니다.  
HTML `<button>`의 모든 기본 속성(`onClick`, `type`, `disabled` 등)을 그대로 사용할 수 있습니다.

### Props

| Prop        | 타입                                                        | 기본값      | 설명                                        |
| ----------- | ----------------------------------------------------------- | ----------- | ------------------------------------------- |
| `variant`   | `"primary" \| "secondary" \| "outline" \| "danger" \| "success"` | `"primary"` | 버튼 디자인 테마              |
| `size`      | `"sm" \| "md" \| "lg"`                                     | `"md"`      | 버튼 크기                                   |
| `isLoading` | `boolean`                                                   | `false`     | 로딩 중 여부 (스피너 표시 + 클릭 차단)      |
| `fullWidth` | `boolean`                                                   | `false`     | 부모 너비 100% 차지 여부                    |
| `children`  | `React.ReactNode`                                           | (필수)      | 버튼 안에 표시할 내용                       |
| `className` | `string`                                                    | —           | 추가 Tailwind 클래스                        |

### variant 종류

| variant     | 사용 상황                                                                 |
| ----------- | ------------------------------------------------------------------------- |
| `primary`   | 페이지당 하나의 주요 액션 (로그인, 저장, 결제 등) — **한 화면에 하나만** |
| `secondary` | 취소, 뒤로 가기 등 Primary의 대안 액션                                   |
| `outline`   | 중요도가 낮은 여러 옵션 나열, 배경 위 버튼                               |
| `danger`    | 삭제, 탈퇴 등 되돌릴 수 없는 위험한 액션                                |
| `success`   | 완료 확인 등 긍정적인 결과를 나타내는 액션                               |

### 사용 예시

```tsx
import Button from "@/components/Button/Button";

// 기본
<Button onClick={() => console.log("클릭!")}>저장</Button>

// 크기
<Button size="sm">작은 버튼</Button>
<Button size="lg">큰 버튼</Button>

// 테마
<Button variant="secondary">취소</Button>
<Button variant="danger">삭제</Button>
<Button variant="outline">더 보기</Button>

// 로딩 상태 (클릭 자동 차단됨)
<Button isLoading>저장 중</Button>

// 너비 100%
<Button fullWidth>로그인</Button>

// form 제출
<Button type="submit" fullWidth>회원가입</Button>
```

---

## Card

정보를 그룹화하고 섹션을 구분하는 컨테이너 컴포넌트입니다.  
`Card.Header`, `Card.Body`, `Card.Footer`를 조합하여 사용합니다.

### 서브 컴포넌트

| 컴포넌트      | Props                          | 설명                              |
| ------------- | ------------------------------ | --------------------------------- |
| `Card`        | `children`, `className`        | 카드 전체 감싸는 컨테이너         |
| `Card.Header` | `title`, `children`, `className` | 카드 상단 영역 (제목, 액션 버튼 등) |
| `Card.Body`   | `children`, `className`        | 카드 본문 영역                    |
| `Card.Footer` | `children`, `className`        | 카드 하단 영역 (버튼, 안내 문구 등) |

> `Card.Header`의 `title` prop을 사용하면 제목이 자동 렌더링됩니다.  
> `title`과 `children`을 동시에 쓰면 제목 아래에 추가 내용을 배치할 수 있습니다.

### 사용 예시

```tsx
import Card from "@/components/Card/Card";

// 기본 구조
<Card>
  <Card.Header title="카드 제목" />
  <Card.Body>
    <p>본문 내용입니다.</p>
  </Card.Body>
  <Card.Footer>
    <Button>확인</Button>
  </Card.Footer>
</Card>

// 헤더에 제목 + 액션 버튼 함께 배치
<Card>
  <Card.Header title="공지사항">
    <Button size="sm" variant="outline">전체 보기</Button>
  </Card.Header>
  <Card.Body>
    <p>공지사항 내용</p>
  </Card.Body>
</Card>

// 추가 스타일 적용
<Card className="border-violet-200">
  <Card.Body className="bg-violet-50">
    <p>강조된 카드</p>
  </Card.Body>
</Card>
```

---

## Checkbox

체크박스 입력 컴포넌트입니다.  
`ref`를 통해 부모에서 input 엘리먼트를 직접 제어할 수 있습니다.

### Props

| Prop         | 타입      | 기본값 | 설명                                                        |
| ------------ | --------- | ------ | ----------------------------------------------------------- |
| `label`      | `string`  | —      | 체크박스 옆에 표시될 텍스트                                 |
| `error`      | `string`  | —      | 에러 메시지 (입력 시 빨간색으로 표시)                       |
| `helperText` | `string`  | —      | 하단 안내 문구 (`error`가 있으면 안내 문구는 숨겨짐)        |

> HTML `input[type="checkbox"]`의 모든 기본 속성(`checked`, `onChange`, `disabled` 등)을 그대로 사용할 수 있습니다.

### 사용 예시

```tsx
import Checkbox from "@/components/Checkbox/Checkbox";
import { useState } from "react";

// 기본
const [checked, setChecked] = useState(false);

<Checkbox
  label="이용약관에 동의합니다"
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>

// 안내 문구 포함
<Checkbox
  label="마케팅 정보 수신 동의"
  helperText="선택 사항입니다."
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>

// 에러 상태
<Checkbox
  label="필수 약관 동의"
  error="필수 항목입니다."
  checked={checked}
  onChange={(e) => setChecked(e.target.checked)}
/>

// 비활성화
<Checkbox label="비활성화된 항목" disabled />

// ref 사용
const checkboxRef = useRef<HTMLInputElement>(null);
<Checkbox ref={checkboxRef} label="참조 가능한 체크박스" />
```

---

## Input

텍스트 입력 컴포넌트입니다.  
`ref`를 통해 부모에서 input 엘리먼트를 직접 제어할 수 있으며, `label`과 `id`가 자동으로 연결됩니다.

### Props

| Prop         | 타입      | 기본값  | 설명                                                        |
| ------------ | --------- | ------- | ----------------------------------------------------------- |
| `label`      | `string`  | —       | 입력창 위에 표시될 라벨                                     |
| `error`      | `string`  | —       | 에러 메시지 (입력창이 빨간색으로 변함)                      |
| `helperText` | `string`  | —       | 하단 안내 문구 (`error`가 있으면 숨겨짐)                    |
| `fullWidth`  | `boolean` | `false` | 너비 100% 여부 (기본값은 고정 너비 `w-80`)                  |

> HTML `input`의 모든 기본 속성(`type`, `placeholder`, `value`, `onChange`, `disabled` 등)을 그대로 사용할 수 있습니다.

### 사용 예시

```tsx
import Input from "@/components/Input/Input";
import { useState, useRef } from "react";

// 기본
const [value, setValue] = useState("");

<Input
  label="이메일"
  type="email"
  placeholder="example@email.com"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// 안내 문구 포함
<Input
  label="비밀번호"
  type="password"
  helperText="8자 이상 입력해주세요."
/>

// 에러 상태
<Input
  label="아이디"
  error="이미 사용 중인 아이디입니다."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>

// 너비 100%
<Input label="검색" placeholder="검색어를 입력하세요" fullWidth />

// ref로 포커스 제어
const inputRef = useRef<HTMLInputElement>(null);
<Input ref={inputRef} label="이름" />
<Button onClick={() => inputRef.current?.focus()}>포커스 이동</Button>
```

---

## Modal

페이지 위에 오버레이로 표시되는 대화상자 컴포넌트입니다.  
`createPortal`을 사용하므로 부모 컴포넌트의 `z-index`나 `overflow` 설정에 영향을 받지 않습니다.

### Props

| Prop       | 타입              | 기본값  | 설명                                             |
| ---------- | ----------------- | ------- | ------------------------------------------------ |
| `isOpen`   | `boolean`         | (필수)  | 모달 열림/닫힘 상태                              |
| `onClose`  | `() => void`      | —       | 닫기 버튼 또는 배경 클릭 시 호출되는 함수        |
| `title`    | `string`          | —       | 모달 상단 제목                                   |
| `children` | `React.ReactNode` | (필수)  | 모달 본문 내용                                   |
| `footer`   | `React.ReactNode` | —       | 모달 하단 영역 (보통 버튼 배치)                  |
| `size`     | `"sm" \| "md" \| "lg"` | `"md"` | 모달 너비 크기                            |

> - 배경 클릭 또는 `Esc` 키로 모달이 닫힙니다 (`onClose` 연결 시).
> - `index.html`에 `<div id="modal-root"></div>`가 있으면 해당 위치에 렌더링되고, 없으면 `document.body`에 렌더링됩니다.

### 사용 예시

```tsx
import Modal from "@/components/Modal/Modal";
import Button from "@/components/Button/Button";
import { useState } from "react";

const [isOpen, setIsOpen] = useState(false);

// 기본
<Button onClick={() => setIsOpen(true)}>모달 열기</Button>

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="확인"
  footer={
    <div className="flex gap-2 justify-end">
      <Button variant="secondary" onClick={() => setIsOpen(false)}>취소</Button>
      <Button onClick={() => { /* 처리 */ setIsOpen(false); }}>확인</Button>
    </div>
  }
>
  <p>정말 삭제하시겠습니까?</p>
</Modal>

// 크기 조절
<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="lg" title="상세 정보">
  <p>넓은 모달 내용</p>
</Modal>

// 폼이 있는 모달
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="회원 정보 수정"
  footer={<Button fullWidth type="submit">저장</Button>}
>
  <Input label="이름" fullWidth />
  <Input label="이메일" type="email" fullWidth />
</Modal>
```

---

## Radio

라디오 버튼 컴포넌트입니다.  
같은 `name` 속성을 가진 Radio 컴포넌트끼리 하나의 그룹으로 묶이며, 그룹 내에서 하나만 선택됩니다.

### Props

| Prop    | 타입     | 기본값 | 설명                                                        |
| ------- | -------- | ------ | ----------------------------------------------------------- |
| `label` | `string` | —      | 라디오 버튼 옆에 표시될 텍스트                              |
| `error` | `string` | —      | 에러 메시지                                                 |

> HTML `input[type="radio"]`의 모든 기본 속성(`name`, `value`, `checked`, `onChange`, `disabled` 등)을 그대로 사용할 수 있습니다.  
> **`name` prop은 반드시 같은 값으로 맞춰야 그룹이 정상 동작합니다.**

### 사용 예시

```tsx
import Radio from "@/components/Radio/Radio";
import { useState } from "react";

const [selected, setSelected] = useState("");

// 기본 라디오 그룹
<div className="flex flex-col gap-2">
  <Radio
    name="gender"
    value="male"
    label="남성"
    checked={selected === "male"}
    onChange={(e) => setSelected(e.target.value)}
  />
  <Radio
    name="gender"
    value="female"
    label="여성"
    checked={selected === "female"}
    onChange={(e) => setSelected(e.target.value)}
  />
  <Radio
    name="gender"
    value="other"
    label="기타"
    checked={selected === "other"}
    onChange={(e) => setSelected(e.target.value)}
  />
</div>

// 에러 상태
<Radio
  name="agree"
  value="yes"
  label="동의합니다"
  error="필수 선택 항목입니다."
  checked={selected === "yes"}
  onChange={(e) => setSelected(e.target.value)}
/>

// 비활성화
<Radio name="plan" value="premium" label="프리미엄 (준비 중)" disabled />
```

---

## Select

커스텀 드롭다운 선택 컴포넌트입니다.  
키보드 탐색(↑↓ 방향키, Enter, Esc)과 외부 클릭 닫힘을 지원합니다.

### Props

| Prop          | 타입                                 | 기본값          | 설명                                          |
| ------------- | ------------------------------------ | --------------- | --------------------------------------------- |
| `options`     | `SelectOption[]`                     | (필수)          | 선택 가능한 옵션 목록                         |
| `onChange`    | `(value: string \| number) => void`  | (필수)          | 옵션 선택 시 호출되는 콜백                    |
| `value`       | `string \| number`                   | —               | 현재 선택된 값                                |
| `label`       | `string`                             | —               | 셀렉트 위에 표시될 라벨                       |
| `placeholder` | `string`                             | `"선택해주세요"` | 선택 전 표시되는 안내 텍스트                  |
| `error`       | `string`                             | —               | 에러 메시지 (빨간색 테두리 표시)              |
| `fullWidth`   | `boolean`                            | `false`         | 너비 100% 여부                                |
| `disabled`    | `boolean`                            | `false`         | 비활성화 여부                                 |

### SelectOption 구조

```ts
interface SelectOption {
  value: string | number; // 실제 전달되는 값
  label: string;          // 화면에 표시되는 텍스트
}
```

### 사용 예시

```tsx
import Select from "@/components/Select/Select";
import { useState } from "react";

const [selected, setSelected] = useState<string | number>("");

const options = [
  { value: "kr", label: "한국어" },
  { value: "en", label: "English" },
  { value: "jp", label: "日本語" },
];

// 기본
<Select
  label="언어 선택"
  options={options}
  value={selected}
  onChange={(val) => setSelected(val)}
/>

// 플레이스홀더 변경
<Select
  options={options}
  value={selected}
  onChange={(val) => setSelected(val)}
  placeholder="언어를 선택하세요"
/>

// 에러 상태
<Select
  label="카테고리"
  options={options}
  value={selected}
  onChange={(val) => setSelected(val)}
  error="카테고리를 선택해주세요."
/>

// 너비 100%
<Select
  label="지역"
  options={options}
  value={selected}
  onChange={(val) => setSelected(val)}
  fullWidth
/>

// 비활성화
<Select
  options={options}
  value="kr"
  onChange={() => {}}
  disabled
/>
```

---

> 디자인 토큰 수정이 필요한 경우 `src/theme/token.ts`를 참고하세요.
