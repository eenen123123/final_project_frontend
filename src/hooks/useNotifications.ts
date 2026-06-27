import { useEffect, useState, useCallback } from "react";
import api from "../api/api";

export interface NotificationItem {
  id: string;
  type: "shipping" | "coupon" | "point" | "course" | "calendar";
  message: string;
  date: string;
  read: boolean;
}

function dDay(target: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const t = new Date(target);
  t.setHours(0, 0, 0, 0);
  return Math.ceil((t.getTime() - now.getTime()) / 86400000);
}

function fmt(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const results: NotificationItem[] = [];
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    const ny = m === 12 ? y + 1 : y;
    const nm = m === 12 ? 1 : m + 1;

    const dataPromises = [
      api.get<{ ordSn: number; ordNm: string; mdfcnDt: string }[]>("/api/shipping/my")
        .then((res) => {
          res.data.forEach((s) => {
            results.push({ id: `shipping-${s.ordSn}`, type: "shipping", message: `"${s.ordNm}" 배송이 진행 중입니다.`, date: s.mdfcnDt ? fmt(s.mdfcnDt) : "", read: false });
          });
        }).catch(() => {}),

      api.get<{ mcpntSn: number; couponNm: string; expiryDt: string }[]>("/api/coupons/my/available")
        .then((res) => {
          res.data.forEach((c) => {
            const d = dDay(c.expiryDt);
            if (d >= 0 && d <= 7) {
              results.push({ id: `coupon-${c.mcpntSn}`, type: "coupon", message: `"${c.couponNm}" 쿠폰이 ${d === 0 ? "오늘" : `D-${d}`} 만료됩니다.`, date: fmt(c.expiryDt), read: false });
            }
          });
        }).catch(() => {}),

      api.get<number>("/api/points/expiring", { params: { assetType: "HM_POINT" } })
        .then((res) => {
          if (res.data > 0) {
            results.push({ id: "point-expiring", type: "point", message: `HM 포인트 ${res.data.toLocaleString()}p가 다음 달 소멸 예정입니다.`, date: "", read: false });
          }
        }).catch(() => {}),

      api.get<{ enrlSn: number; courseNm: string; accsEndDt: string }[]>("/api/mypage/courses")
        .then((res) => {
          res.data.forEach((c) => {
            const d = dDay(c.accsEndDt);
            if (d >= 0 && d <= 14) {
              results.push({ id: `course-${c.enrlSn}`, type: "course", message: `"${c.courseNm}" 수강 기간이 ${d === 0 ? "오늘" : `D-${d}`} 만료됩니다.`, date: fmt(c.accsEndDt), read: false });
            }
          });
        }).catch(() => {}),

      Promise.all([
        api.get<{ eventSn: number; eventType: string; eventTitle: string; startDt: string }[]>("/api/calendar/event", { params: { year: y, month: m } }),
        api.get<{ eventSn: number; eventType: string; eventTitle: string; startDt: string }[]>("/api/calendar/event", { params: { year: ny, month: nm } }),
      ]).then(([ev1, ev2]) => {
        [...ev1.data, ...ev2.data]
          .filter((e) => e.eventType === "academic")
          .forEach((e) => {
            const d = dDay(e.startDt);
            if (d === 7 || d === 1) {
              results.push({
                id: `event-${e.eventSn}-d${d}`,
                type: "calendar",
                message: `'${e.eventTitle}' 까지 D-${d}일 남았습니다.`,
                date: fmt(e.startDt),
                read: false,
              });
            }
          });
      }).catch(() => {}),
    ];

    Promise.all([
      ...dataPromises,
      api.get<string[]>("/api/notifications/read").then((r) => r.data).catch(() => [] as string[]),
      api.get<string[]>("/api/notifications/dismissed").then((r) => r.data).catch(() => [] as string[]),
    ]).then((settled) => {
      const readIds = settled[settled.length - 2] as string[];
      const dismissedIds = settled[settled.length - 1] as string[];

      results.sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return b.date.localeCompare(a.date);
      });

      setNotifications(
        results
          .filter((n) => !dismissedIds.includes(n.id))
          .map((n) => ({ ...n, read: readIds.includes(n.id) }))
      );
      setLoading(false);
    });
  }, []);

  const markAsRead = useCallback((notiId: string) => {
    api.post(`/api/notifications/read/${notiId}`).catch(() => {});
    setNotifications((prev) => prev.map((n) => n.id === notiId ? { ...n, read: true } : n));
  }, []);

  const dismiss = useCallback((notiId: string) => {
    api.delete(`/api/notifications/${notiId}`).catch(() => {});
    setNotifications((prev) => prev.filter((n) => n.id !== notiId));
  }, []);

  return { notifications, loading, markAsRead, dismiss };
}
