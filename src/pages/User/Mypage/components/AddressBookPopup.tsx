interface MemberAddress {
  addressSn: number;
  addressNm: string;
  receiverNm: string;
  receiverTel: string;
  zipCd: string;
  addrRoad: string;
  addrJibun: string;
  addrDtl: string;
  deliveryMsg: string;
  defaultYn: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (address: MemberAddress) => void;
  addressList: MemberAddress[];
}

export default function AddressBookPopup({ open, onClose, onSelect, addressList }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-[460px] shadow-2xl border border-gray-200 flex flex-col max-h-[80vh]">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gray-800 shrink-0">
          <h3 className="text-sm font-bold text-white">배송지 주소록</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white cursor-pointer text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* 목록 */}
        <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
          {addressList.length === 0 ? (
            <p className="py-16 text-center text-sm text-gray-400">
              저장된 배송지가 없습니다.
            </p>
          ) : (
            addressList.map((a) => (
              <button
                key={a.addressSn}
                type="button"
                onClick={() => onSelect(a)}
                className="w-full text-left px-5 py-4 hover:bg-orange-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-gray-800">{a.addressNm}</span>
                  {a.defaultYn === "Y" && (
                    <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-600 font-bold">
                      기본
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700">{a.receiverNm} · {a.receiverTel}</p>
                <p className="text-xs text-gray-400 mt-0.5">{a.addrRoad} {a.addrDtl}</p>
              </button>
            ))
          )}
        </div>

        {/* 푸터 */}
        <div className="px-5 py-3 border-t border-gray-200 shrink-0 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
