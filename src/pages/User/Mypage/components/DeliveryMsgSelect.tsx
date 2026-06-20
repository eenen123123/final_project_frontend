import { useState, useEffect } from "react";

const PRESETS = [
  "문 앞에 놓아주세요",
  "경비실에 맡겨주세요",
  "부재 시 문 앞에 놓아주세요",
  "배송 전 연락 부탁드립니다",
];

interface Props {
  value: string;
  onChange: (value: string) => void;
  inputClassName?: string;
}

export default function DeliveryMsgSelect({ value, onChange, inputClassName = "" }: Props) {
  const isCustom = value !== "" && !PRESETS.includes(value);
  const [selectVal, setSelectVal] = useState(isCustom ? "직접입력" : value);
  const [customVal, setCustomVal] = useState(isCustom ? value : "");

  useEffect(() => {
    const isC = value !== "" && !PRESETS.includes(value);
    setSelectVal(isC ? "직접입력" : value);
    setCustomVal(isC ? value : "");
  }, []);

  const handleSelect = (v: string) => {
    setSelectVal(v);
    if (v === "직접입력") {
      onChange(customVal);
    } else {
      setCustomVal("");
      onChange(v);
    }
  };

  const handleCustom = (v: string) => {
    setCustomVal(v);
    onChange(v);
  };

  const cls = `border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-orange-400 ${inputClassName}`;

  return (
    <div className="flex-1 space-y-1.5">
      <select
        value={selectVal}
        onChange={(e) => handleSelect(e.target.value)}
        className={`w-full cursor-pointer ${cls}`}
      >
        <option value="">배송 요청사항 선택</option>
        {PRESETS.map((p) => <option key={p} value={p}>{p}</option>)}
        <option value="직접입력">직접입력</option>
      </select>
      {selectVal === "직접입력" && (
        <input
          type="text"
          value={customVal}
          onChange={(e) => handleCustom(e.target.value)}
          placeholder="배송 요청사항을 입력해주세요"
          className={`w-full ${cls}`}
        />
      )}
    </div>
  );
}
