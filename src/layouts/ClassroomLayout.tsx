import { Outlet } from "react-router-dom";

export default function ClassroomLayout() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans antialiased selection:bg-blue-100">

      <header className="bg-white border-b border-slate-200/60 px-6 py-3.5 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3.5">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-extrabold w-9 h-9 flex items-center justify-center rounded-xl text-xs tracking-tighter">
            H
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
              HERMES
              <span className="text-[11px] font-medium text-slate-300">|</span>
              <span className="text-[13px] font-semibold text-slate-600">클래스룸</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-bold tracking-wider uppercase mt-0.5">
              Classroom Dashboard
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 transition-all relative">
            <span className="text-sm">🔔</span>
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-blue-500 rounded-full border border-white"></span>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 transition-all">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 transition-all">
            <span className="text-sm">⚙️</span>
          </button>
        </div>
      </header>

      <Outlet />
    </div>
  );
}
