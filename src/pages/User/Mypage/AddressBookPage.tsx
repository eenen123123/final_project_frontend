import { useState, useEffect } from "react";
import { useKakaoPostcodePopup } from "react-daum-postcode";
import api from "../../../api/api";
import DeliveryMsgSelect from "./components/DeliveryMsgSelect";

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

const PHONE_CODES = ["010", "011", "016", "017", "018", "019"];

const emptyForm = {
  addressNm: "",
  receiverNm: "",
  phoneCode: "010",
  phoneMid: "",
  phoneLast: "",
  zipCd: "",
  addrRoad: "",
  addrJibun: "",
  addrDtl: "",
  deliveryMsg: "",
  defaultYn: "N",
};

function parseTel(tel: string) {
  const parts = tel?.split("-") ?? [];
  return {
    phoneCode: parts[0] ?? "010",
    phoneMid: parts[1] ?? "",
    phoneLast: parts[2] ?? "",
  };
}

export default function AddressBookPage() {
  const [addresses, setAddresses] = useState<MemberAddress[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSn, setEditingSn] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const openPostcode = useKakaoPostcodePopup();

  const fetchAddresses = () => {
    api.get<MemberAddress[]>("/api/addresses")
      .then((res) => setAddresses(res.data))
      .catch(() => setAddresses([]));
  };

  useEffect(() => { fetchAddresses(); }, []);

  const handleSelect = (a: MemberAddress) => {
    window.opener?.postMessage({ type: "ADDRESS_SELECTED", address: a }, window.location.origin);
    window.close();
  };

  const openNewForm = () => {
    setEditingSn(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (a: MemberAddress) => {
    const { phoneCode, phoneMid, phoneLast } = parseTel(a.receiverTel);
    setForm({
      addressNm: a.addressNm,
      receiverNm: a.receiverNm,
      phoneCode,
      phoneMid,
      phoneLast,
      zipCd: a.zipCd ?? "",
      addrRoad: a.addrRoad ?? "",
      addrJibun: a.addrJibun ?? "",
      addrDtl: a.addrDtl ?? "",
      deliveryMsg: a.deliveryMsg ?? "",
      defaultYn: a.defaultYn,
    });
    setEditingSn(a.addressSn);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingSn(null);
    setForm(emptyForm);
  };

  const handleAddressSearch = () => {
    openPostcode({
      onComplete: (data) => {
        setForm((prev) => ({
          ...prev,
          zipCd: data.zonecode,
          addrRoad: data.address,
          addrJibun: data.jibunAddress,
        }));
      },
    });
  };

  const handleSave = async () => {
    if (!form.receiverNm.trim()) { alert("수령인 이름을 입력해주세요."); return; }
    if (!form.phoneMid || !form.phoneLast) { alert("연락처를 입력해주세요."); return; }
    if (!form.addrRoad.trim()) { alert("주소를 검색해주세요."); return; }

    const receiverTel = `${form.phoneCode}-${form.phoneMid}-${form.phoneLast}`;
    const payload = { ...form, receiverTel };

    setSaving(true);
    try {
      if (editingSn !== null) {
        await api.post(`/api/addresses/${editingSn}`, payload);
      } else {
        await api.post("/api/addresses", payload);
      }
      closeForm();
      fetchAddresses();
    } catch {
      alert(editingSn ? "배송지 수정에 실패했습니다." : "배송지 등록에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (addressSn: number) => {
    if (!confirm("이 배송지를 삭제하시겠습니까?")) return;
    try {
      await api.delete(`/api/addresses/${addressSn}`);
      fetchAddresses();
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  const handleSetDefault = async (addressSn: number) => {
    try {
      await api.post(`/api/addresses/${addressSn}/default`);
      fetchAddresses();
    } catch {
      alert("기본 배송지 변경에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-gray-800 shrink-0">
        <h2 className="text-sm font-bold text-white">배송지 주소록</h2>
        <button type="button" onClick={() => window.close()} className="text-gray-400 hover:text-white text-lg cursor-pointer">✕</button>
      </div>

      {/* 새 배송지 등록 버튼 */}
      {!showForm && (
        <div className="px-5 py-3 border-b border-gray-200">
          <button
            type="button"
            onClick={openNewForm}
            className="w-full py-2.5 border-2 border-dashed border-orange-300 text-orange-500 text-sm font-semibold hover:bg-orange-50 transition-colors cursor-pointer"
          >
            + 새 배송지 등록
          </button>
        </div>
      )}

      {/* 등록/수정 폼 */}
      {showForm && (
        <div className="border-b border-gray-200 bg-orange-50/40 px-5 py-4 space-y-3">
          <p className="text-sm font-bold text-gray-800 mb-1">
            {editingSn !== null ? "배송지 수정" : "새 배송지 등록"}
          </p>

          <div className="flex items-center gap-3">
            <label className="w-20 text-xs text-gray-500 text-right shrink-0">배송지명</label>
            <input
              type="text"
              value={form.addressNm}
              onChange={(e) => setForm({ ...form, addressNm: e.target.value })}
              maxLength={10}
              className="flex-1 border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-orange-400"
              placeholder="예) 집, 학원 등 (10자 이내)"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="w-20 text-xs text-gray-500 text-right shrink-0">수령인 <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={form.receiverNm}
              onChange={(e) => setForm({ ...form, receiverNm: e.target.value })}
              className="flex-1 border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-orange-400"
              placeholder="수령인 이름"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="w-20 text-xs text-gray-500 text-right shrink-0">연락처 <span className="text-red-400">*</span></label>
            <div className="flex items-center gap-1.5">
              <select
                value={form.phoneCode}
                onChange={(e) => setForm({ ...form, phoneCode: e.target.value })}
                className="border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:border-orange-400 cursor-pointer"
              >
                {PHONE_CODES.map((c) => <option key={c}>{c}</option>)}
              </select>
              <span className="text-gray-800 text-xs">-</span>
              <input type="text" maxLength={4} value={form.phoneMid}
                onChange={(e) => setForm({ ...form, phoneMid: e.target.value.replace(/\D/g, "") })}
                className="w-16 border border-gray-300 px-2 py-1.5 text-sm text-center focus:outline-none focus:border-orange-400"
                placeholder="0000" />
              <span className="text-gray-800 text-xs">-</span>
              <input type="text" maxLength={4} value={form.phoneLast}
                onChange={(e) => setForm({ ...form, phoneLast: e.target.value.replace(/\D/g, "") })}
                className="w-16 border border-gray-300 px-2 py-1.5 text-sm text-center focus:outline-none focus:border-orange-400"
                placeholder="0000" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <label className="w-20 text-xs text-gray-500 text-right shrink-0 pt-2">주소 <span className="text-red-400">*</span></label>
            <div className="flex-1 space-y-1.5">
              <div className="flex gap-2">
                <input type="text" value={form.zipCd} readOnly placeholder="우편번호"
                  className="w-24 border border-gray-300 px-3 py-1.5 text-sm bg-gray-50" />
                <button type="button" onClick={handleAddressSearch}
                  className="px-3 py-1.5 bg-gray-700 text-white text-xs hover:bg-gray-900 transition-colors cursor-pointer">
                  주소 검색
                </button>
              </div>
              <input type="text" value={form.addrRoad} readOnly placeholder="도로명 주소"
                className="w-full border border-gray-300 px-3 py-1.5 text-sm bg-gray-50" />
              <input type="text" value={form.addrDtl}
                onChange={(e) => setForm({ ...form, addrDtl: e.target.value })}
                placeholder="상세주소"
                className="w-full border border-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <label className="w-20 text-xs text-gray-500 text-right shrink-0 pt-2">배송 메모</label>
            <DeliveryMsgSelect value={form.deliveryMsg} onChange={(v) => setForm({ ...form, deliveryMsg: v })} />
          </div>
          <div className="flex items-center gap-3">
            <span className="w-20 shrink-0" />
            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
              <input type="checkbox" checked={form.defaultYn === "Y"}
                onChange={(e) => setForm({ ...form, defaultYn: e.target.checked ? "Y" : "N" })}
                className="accent-orange-500" />
              기본 배송지로 설정
            </label>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button type="button" onClick={closeForm}
              className="px-4 py-2 border border-gray-300 text-xs text-gray-600 hover:bg-gray-50 cursor-pointer">
              취소
            </button>
            <button type="button" onClick={handleSave} disabled={saving}
              className="px-4 py-2 bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50">
              {saving ? "저장 중..." : "저장"}
            </button>
          </div>
        </div>
      )}

      {/* 주소 목록 */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {addresses.length === 0 && !showForm ? (
          <p className="py-16 text-center text-sm text-gray-400">저장된 배송지가 없습니다.</p>
        ) : (
          addresses.map((a) => (
            <div key={a.addressSn} className="px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-3">
                {/* 선택 영역 */}
                <button type="button" onClick={() => handleSelect(a)} className="flex-1 text-left cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-800">{a.addressNm}</span>
                    {a.defaultYn === "Y" && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-600 font-bold">기본</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{a.receiverNm} · {a.receiverTel}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.addrRoad} {a.addrDtl}</p>
                </button>

                {/* 액션 버튼 */}
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  {a.defaultYn !== "Y" && (
                    <button type="button" onClick={() => handleSetDefault(a.addressSn)}
                      className="text-xs text-orange-500 hover:text-orange-700 cursor-pointer whitespace-nowrap">
                      기본으로 설정
                    </button>
                  )}
                  <div className="flex gap-2">
                    <button type="button" onClick={() => openEditForm(a)}
                      className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer">
                      수정
                    </button>
                    <button type="button" onClick={() => handleDelete(a.addressSn)}
                      className="text-xs text-gray-400 hover:text-red-500 cursor-pointer">
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
