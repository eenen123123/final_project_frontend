import { useState, useEffect, useCallback, useRef } from "react";

export interface PageResponse<T> {
  items: T[];
  totalCount: number;
}

interface Options {
  pageSize?: number;
  blockSize?: number;
  enabled?: boolean;
  extraDeps?: unknown[];
}

export function usePaginatedSearch<T>(
  fetcher: (page: number, size: number, keyword: string) => Promise<PageResponse<T>>,
  options: Options = {}
) {
  const { pageSize = 10, blockSize = 5, enabled = true, extraDeps = [] } = options;
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const [items, setItems] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const totalPages = Math.ceil(totalCount / pageSize);
  const endPage = Math.min(totalPages, Math.ceil(page / blockSize) * blockSize);
  const startPage = Math.max(1, endPage - blockSize + 1);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetcherRef.current(page, pageSize, keyword);
        if (!cancelled) {
          setItems(result.items);
          setTotalCount(result.totalCount);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, keyword, enabled, ...extraDeps]);

  const handleSearch = useCallback(() => {
    if (!searchInput.trim()) {
      alert("검색값을 입력하세요");
      return;
    }
    setKeyword(searchInput.trim());
    setPage(1);
  }, [searchInput]);

  return {
    items,
    totalCount,
    loading,
    page,
    totalPages,
    startPage,
    endPage,
    searchInput,
    setSearchInput,
    handleSearch,
    setPage,
  };
}
