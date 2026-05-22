import React from "react";
import { twMerge } from "tailwind-merge";
import { cardTokens } from "../../theme/token"; // 설정하신 경로에 맞춰 조절하세요

interface CardProps {
  /** 카드 레이아웃 내부에 배치될 리액트 자식 노드 요소입니다. */
  children?: React.ReactNode;

  /** 카드 컨테이너 외곽 영역이나 내부 여백 등을 미세 조정/확장하기 위해 주입하는 커스텀 Tailwind CSS 스타일 클래스입니다. */
  className?: string;
}

interface CardHeaderProps extends CardProps {
  /** 카드 상단 섹션에 굵고 명시적으로 출력할 메인 제목 텍스트입니다. */
  title?: string;
}

/**
 * 네임스페이스 하위 서브 컴포넌트들을 함께 묶어 제공하기 위한 복합 카드(Card) 컴포넌트 타입 정의입니다.
 */
type CardComponent = React.FC<CardProps> & {
  /** 카드의 상단 영역을 담당하며 제목(title)과 우측 액션 버튼, 서브 타이틀 등을 정돈되게 배치합니다. */
  Header: React.FC<CardHeaderProps>;
  /** 카드의 중심이 되는 메인 본문 콘텐츠 스페이스를 확보하고 일관된 패딩 스타일을 부여합니다. */
  Body: React.FC<CardProps>;
  /** 카드의 하단 영역으로, 주로 '확인', '취소' 버튼 배치나 최종 액션 가이드를 포함합니다. */
  Footer: React.FC<CardProps>;
};

/**
 * 관련 정보들을 논리적 단위로 그룹화하고 화면 내에서 섹션을 명확히 구분해주는 박스 컨테이너(Card) 컴포넌트입니다.
 * * ### ✨ 주요 특징 및 패턴 (Sub-components)
 * - **유연한 레이아웃 합성**: 고정된 레이아웃 대신 `Card.Header`, `Card.Body`, `Card.Footer` 조각을 개발자가 원하는 순서와 조합으로 자유롭게 배치할 수 있도록 설계되었습니다.
 * - **안전한 클래스 병합**: `twMerge`가 내장되어 있어, 외부 레이아웃 배치를 위해 `className`으로 마진(`mt-4`)이나 배경색을 덮어씌워도 스타일 깨짐 없이 안정적으로 오버라이딩됩니다.
 * * ### 🛠️ 권장 사용 구조
 * ```tsx
 * <Card>
 * <Card.Header title="카드 제목" />
 * <Card.Body>여기에 메인 본문 내용을 작성합니다.</Card.Body>
 * <Card.Footer>하단 버튼 영역</Card.Footer>
 * </Card>
 * ```
 * * @example
 * // 1. 제목과 본문, 하단 액션 버튼이 모두 포함된 전형적인 피드/대시보드 아이템 예시
 * <Card className="shadow-lg">
 * <Card.Header title="새로운 업데이트 정보">
 * <Badge variant="success">New</Badge>
 * </Card.Header>
 * <Card.Body>
 * <p>공통 UI 디자인 시스템의 주석 표준화 작업이 모두 완료되었습니다.</p>
 * </Card.Body>
 * <Card.Footer className="justify-end gap-2">
 * <Button variant="secondary" size="sm">자세히 보기</Button>
 * <Button variant="primary" size="sm">확인</Button>
 * </Card.Footer>
 * </Card>
 */
const Card: CardComponent = ({ children, className }) => {
  return <div className={twMerge(cardTokens.base, className)}>{children}</div>;
};

/**
 * Card.Header: 카드의 상단 헤더 영역을 렌더링하는 서브 컴포넌트입니다.
 * * - `title` 속성이 전달되면 카드 표준 타이틀 스타일(`h3`)로 텍스트를 자동 출력합니다.
 * - `children`을 함께 넘겨주면 타이틀 우측이나 아래쪽에 정렬되어 추가 액션 도구(버튼, 배지 등)를 자연스럽게 나열할 수 있습니다.
 */
Card.Header = ({ children, title, className }: CardHeaderProps) => {
  return (
    <div className={twMerge(cardTokens.header, className)}>
      {/* title이 전달되면 제목을 렌더하고, children은 제목 아래에 추가 콘텐츠로 표시됩니다. */}
      {title && <h3 className={cardTokens.title}>{title}</h3>}
      {children}
    </div>
  );
};

/**
 * Card.Body: 카드의 핵심 메인 콘텐츠가 담기는 중심 영역 서브 컴포넌트입니다.
 * * - 텍스트 단락, 미디어 이미지, 폼 입력 뷰(`Input`, `Checkbox`) 등 카드가 담아야 할 메인 요소들을 일관된 내부 패딩 공간 안에 정돈합니다.
 */
Card.Body = ({ children, className }: CardProps) => {
  return <div className={twMerge(cardTokens.body, className)}>{children}</div>;
};

/**
 * Card.Footer: 카드의 가장 하단 마무리를 장식하는 액션 바 영역 서브 컴포넌트입니다.
 * * - 주로 폼 제출/취소 버튼 세트나 작가 정보, 등록일 정보 등 최종적인 액션 및 메타데이터를 배치하기에 적합합니다.
 */
Card.Footer = ({ children, className }: CardProps) => {
  return (
    <div className={twMerge(cardTokens.footer, className)}>{children}</div>
  );
};

export default Card;
