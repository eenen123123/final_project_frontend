import React from "react";
import { twMerge } from "tailwind-merge";
import { cardTokens } from "../../theme/token"; // 설정하신 경로에 맞춰 조절하세요

interface CardProps {
  children?: React.ReactNode;
  className?: string;
}

interface CardHeaderProps extends CardProps {
  title?: string;
}

type CardComponent = React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardProps>;
  Footer: React.FC<CardProps>;
};

/**
 * Card 컴포넌트: 정보를 그룹화하고 섹션을 구분하는 컨테이너입니다.
 *
 * Card는 일반적으로 다음과 같이 사용합니다:
 * <Card>
 *   <Card.Header title="제목" />
 *   <Card.Body>...</Card.Body>
 *   <Card.Footer>...</Card.Footer>
 * </Card>
 *
 * className을 전달하면 카드 전체에 추가 스타일을 적용할 수 있습니다.
 */
const Card: CardComponent = ({ children, className }) => {
  return <div className={twMerge(cardTokens.base, className)}>{children}</div>;
};

/**
 * Card.Header: 카드의 상단 영역 (제목과 함께 액션, 서브타이틀 등을 배치)
 *
 * title이 제공되면 제목을 렌더하고,
 * children이 함께 전달되면 제목 아래에 추가 콘텐츠를 함께 배치합니다.
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
 * Card.Body: 카드의 메인 콘텐츠 영역
 */
Card.Body = ({ children, className }: CardProps) => {
  return <div className={twMerge(cardTokens.body, className)}>{children}</div>;
};

/**
 * Card.Footer: 카드의 하단 영역 (주로 버튼이나 안내 문구)
 *
 * Footer는 버튼이나 상태 표시 등 카드의 최종 액션을 포함하는 영역입니다.
 */
Card.Footer = ({ children, className }: CardProps) => {
  return (
    <div className={twMerge(cardTokens.footer, className)}>{children}</div>
  );
};

export default Card;
