import { useAuth } from "../../auth/AuthContext";
import Card from "../../components/Card/Card";
import Badge from "../../components/Badge/Badge";

const roleLabel: Record<string, string> = {
  ROLE_ADMIN: "관리자",
  ROLE_USER: "일반 사용자",
};

const roleBadgeVariant: Record<
  string,
  "primary" | "secondary" | "danger" | "success" | "outline"
> = {
  ROLE_ADMIN: "danger",
  ROLE_USER: "primary",
};

export default function MyPage() {
  const { getUserId, getRole, getUserName } = useAuth();
  const userId = getUserId();
  const userName = getUserName();
  const role = getRole();

  const displayRole = role ? (roleLabel[role] ?? role) : "-";
  const badgeVariant = role ? (roleBadgeVariant[role] ?? "secondary") : "secondary";

  return (
    <div className="max-w-lg mx-auto mt-12 px-4">
      <Card>
        <Card.Header>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 text-2xl font-bold select-none">
              {userName ? userName.charAt(0).toUpperCase() : "?"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{userName ?? "-"}</h2>
              <Badge variant={badgeVariant} dot className="mt-1">
                {displayRole}
              </Badge>
            </div>
          </div>
        </Card.Header>

        <Card.Body>
          <dl className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <dt className="text-sm font-medium text-gray-500">아이디</dt>
              <dd className="text-sm text-gray-900 font-mono">{userId ?? "-"}</dd>
            </div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <dt className="text-sm font-medium text-gray-500">이름</dt>
              <dd className="text-sm text-gray-900">{userName ?? "-"}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm font-medium text-gray-500">권한</dt>
              <dd>
                <Badge variant={badgeVariant}>{displayRole}</Badge>
              </dd>
            </div>
          </dl>
        </Card.Body>

        <Card.Footer>
          <p className="text-xs text-gray-400">계정 정보는 관리자에게 문의해 주세요.</p>
        </Card.Footer>
      </Card>
    </div>
  );
}
