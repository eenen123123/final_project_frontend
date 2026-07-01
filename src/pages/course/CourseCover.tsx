import type { Course } from "./Course";

export default function CourseCover({ course }: { course: Course }) {
  return (
    <div
      className={`w-20 h-28 sm:w-32 sm:h-44
        
        ${
          course.courseName.includes("수능특강")
            ? "bg-linear-to-r from-blue-400 to-indigo-400"
            : course.courseName.includes("수능완성")
              ? "bg-linear-to-r from-yellow-300 to-amber-300"
              : "bg-red-400/80"
        }
         
         rounded-xl shadow-sm p-2 sm:p-3 flex flex-col justify-between text-white border-l-4 border-black/20`}
    >
      <div className="space-y-0.5 sm:space-y-1 text-shadow-md">
        <span className="text-[8px] sm:text-[11px] bg-white/20 px-1 py-0.5 rounded font-bold tracking-widest uppercase w-fit hidden sm:block">
          HERMES
        </span>
        <h5 className="text-[8px] sm:text-[12px] font-bold leading-tight line-clamp-2 mt-1 hidden sm:block px-1 py-0.5 bg-white/20 rounded w-fit">
          {course.subjectName}
        </h5>
        <h5 className="text-[9px] sm:text-[13px] font-bold leading-tight line-clamp-2 mt-1">
          {course.courseName.split("]")[0] + "]"}
        </h5>
        <h5 className="text-[9px] sm:text-[13px] font-bold leading-tight line-clamp-3 mt-1">
          {course.courseName.split("]")[1]?.trim()}
        </h5>
      </div>
      <span className="text-[8px] sm:text-[11px] font-medium text-right block opacity-80 text-shadow-md">
        {course.instructorName}
      </span>
    </div>
  );
}
