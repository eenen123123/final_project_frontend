import { mkdirSync } from "fs";

/*
www.ebsi.co.kr/ebs/lms/player/retrieveLmsPlayerHtml5.ebs?sbjtapplyId=&sbjtId=S20260000011

 */

import axios from "axios";
import { parseHTML } from "linkedom";

const baseUrl =
  "https://www.ebsi.co.kr/ebs/lms/player/retrieveLmsPlayerHtml5.ebs";

const courseIds = [
  // { name: "[2026 내신만점 수능특강] 원정의의 영어", id: "S20260000011" },  // 업로드 완료
  { name: "[2027 수능특강] 윤혜정의 독서 - 전 문항", id: "S20250000858" },
  { name: "[2027] 4의규칙 - [지수함수와 로그함수]", id: "S20250000864" },
  // { name: "[2026 내신만점 수능특강] 권유정의 생활과 윤리", id: "S20250000045" }, // 업로드 완료
  {
    name: "[2026 내신만점 수능특강] 박민아의 정치와 법 - 전 문항",
    id: "S20240000942",
  },
  { name: "[2026 내신만점 수능특강] 손은정의 화학Ⅱ", id: "S20250000058" },
];

const getCourseData = async (name: string, courseId: string) => {
  try {
    const res = await axios.get(baseUrl, {
      params: {
        sbjtapplyId: "",
        sbjtId: courseId,
      },
    });
    const html = res.data as string;

    const { document } = parseHTML(html);
    const dateElem = document.querySelectorAll("#contentsLesson > tr");
    if (dateElem) {
      for (const elem of dateElem) {
        const lectureId = elem.id;
        const title = elem
          .querySelector("td > a")
          ?.textContent.replaceAll(" ", "_")
          .trim();
        // console.log(`\n강좌ID: ${lectureId}, 제목: ${title}`);
        console.log("");

        await getVideo(courseId, lectureId, title ?? "unknown", name);
      }
    }
  } catch (e) {
    console.error("강좌 정보 조회 실패", e);
  }
};
// https://wstr.ebsi.co.kr/M41M2601/S20260000011/S20260000011_1M4_100030080662.mp4
async function getVideo(
  courseId: string,
  lectureId: string,
  title: string,
  name: string,
) {
  const response = await axios.get(
    `https://www.ebsi.co.kr/ebs/lms/player/retrieveLmsPlayerHtml5.ebs?sbjtapplyId=&sbjtId=${courseId}&lessonId=${lectureId}&lecGbn=V1M4`,
  );

  const document = parseHTML(response.data).document;
  const videoUrl = document.querySelector("#medUrl")?.getAttribute("value");

  if (!videoUrl)
    throw new Error(
      `Video URL not found for courseId: ${courseId}, lectureId: ${lectureId}`,
    );
  const res = await fetch(videoUrl);
  const total = Number(res.headers.get("content-length") || 0);
  let received = 0;
  const dir = `./videos/${name.replaceAll(" ", "_")}`;
  mkdirSync(dir, { recursive: true }); // 먼저 디렉토리 생성
  const file = Bun.file(`${dir}/${title}.mp4`, { type: "video/mp4" });
  const writer = file.writer();
  const reader = res.body!.getReader();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    writer.write(value);
    received += value.byteLength;
    if (total)
      process.stdout.write(
        `\r[${title}] ${((received / total) * 100).toFixed(1)}%`,
      );
  }

  await writer.end();
}

async function main() {
  for (const course of courseIds) {
    await getCourseData(course.name, course.id);
  }
}

main();
