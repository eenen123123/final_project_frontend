import { useState } from 'react';

interface WithdrawSectionProps {
  onWithdraw: () => void;
}

export default function WithdrawSection({ onWithdraw }: WithdrawSectionProps) {
  const [withdrawConfirm, setWithdrawConfirm] = useState('');

  return (
    <div className="bg-white border border-red-100 rounded-xl overflow-hidden shadow-sm">
      <div className="px-5 py-3.5 border-b border-red-100 flex items-center gap-2">
        <div className="w-0.5 h-4 rounded-full bg-red-500"></div>
        <p className="text-sm font-medium text-gray-900">회원 탈퇴</p>
      </div>
      <div className="px-5 py-5 space-y-4">
        <div className="p-4 bg-red-50 border border-red-100 rounded-lg space-y-1.5">
          <p className="text-xs font-medium text-red-700">탈퇴 전 꼭 확인해주세요</p>
          <ul className="space-y-1">
            {[
              '탈퇴 시 모든 개인정보 및 학습 데이터가 삭제됩니다.',
              '수강 중인 강좌 및 결제 내역이 모두 사라집니다.',
              '삭제된 데이터는 복구가 불가능합니다.',
            ].map((text) => (
              <li key={text} className="text-xs text-red-600 flex items-start gap-1.5">
                <span className="mt-0.5 flex-shrink-0">•</span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">
            탈퇴를 원하시면 아래에{' '}
            <span className="font-medium text-red-500">회원탈퇴</span>를 입력해주세요.
          </label>
          <input
            type="text"
            value={withdrawConfirm}
            onChange={(e) => setWithdrawConfirm(e.target.value)}
            placeholder="회원탈퇴"
            className="w-full text-sm"
            style={{ borderColor: '#FCA5A5' }}
          />
        </div>
        <div className="flex justify-center pt-2">
          <button
            disabled={withdrawConfirm !== '회원탈퇴'}
            onClick={onWithdraw}
            className="px-8 py-2 text-sm font-medium text-white rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#EF4444' }}
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
}
