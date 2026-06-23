// course crawler

import axios from "axios";
import { parseHTML } from "linkedom";
import { mkdirSync } from "fs";

const CATEGORY_CODES = {
  국어: "A100",
  수학: "A300",
  영어: "A200",
  과학: "A400",
  사회: "A500",
};

const COURSE_LIST_BASE_URL =
  "https://www.ebsi.co.kr/ebs/pot/potn/selectCourseListByArea.ajax";

interface BookDetail {
  title: string | null | undefined;
  price: string | null | undefined;
  image: string | null | undefined;
  pubDate: string | null | undefined;
  publisher: string | null | undefined;
}

interface CourseDetail {
  title: string | null | undefined;
  instructor: string | null | undefined;
  explain: string | null | undefined;
  book: BookDetail | null | undefined;
}

async function getBook(
  courseId: string,
  categoryCode: string,
): Promise<BookDetail | undefined> {
  try {
    const res = await axios.post(
      `https://www.ebsi.co.kr/ebs/lms/lmst/popupBookInfo.ajax?courseId=${courseId}&categoryCode=${categoryCode}`,
    );
    const html = res.data as string;

    const { document } = parseHTML(html);
    const title = document
      .querySelector(".thumb")
      ?.querySelectorAll("img")
      .item(1)
      .getAttribute("alt");
    const img = document
      .querySelector(".thumb")
      ?.querySelectorAll("img")
      .item(1)
      .getAttribute("src");
    const bookInfo = document
      .querySelector(".book_info")
      ?.querySelectorAll("li");
    console.log(bookInfo?.item(0)?.querySelector("div")?.textContent);

    const publisher = bookInfo
      ?.item(2)
      ?.querySelector("div")
      ?.textContent?.trim();
    const pubDate = bookInfo
      ?.item(3)
      ?.querySelector("div")
      ?.textContent?.trim();
    const price = bookInfo?.item(4)?.querySelector("div")?.textContent?.trim();

    // console.log(
    //   `교재 제목: ${title}, 출판사: ${publisher}, 출간일: ${pubDate}, 가격: ${price}, 이미지: ${img}`,
    // );

    return {
      title,
      price,
      image: img,
      pubDate,
      publisher,
    };
  } catch (e) {
    console.error("교재 정보 조회 실패", e);
  }
}

const testCourseListFetch = async () => {
  for (const category in CATEGORY_CODES) {
    try {
      const res = await axios.post(
        COURSE_LIST_BASE_URL +
          `?categoryCode=${CATEGORY_CODES[category as keyof typeof CATEGORY_CODES]}&clsfnSystId=&sort=&searchCondition=LEC&searchKeyword=`,
      );
      const html = res.data as string;

      const { document } = parseHTML(html);
      const series = document.querySelector(".thumb_list");
      // console.log(series?.outerHTML);

      const courses = series?.querySelectorAll("li");

      const dir = `./courses/${category}`;
      mkdirSync(dir, { recursive: true });

      for (const course of courses ?? []) {
        const title = course
          .querySelector(".tit > a")
          ?.textContent.replaceAll(" ", "_");
        const courseId = course
          .querySelector(".tit > a")
          ?.getAttribute("href")
          ?.replace("/ebs/lms/lmsx/retrieveSbjtDtl.ebs?courseId=", "");
        const detailInfo = course.querySelector(".detail_info");
        const instructor = detailInfo?.querySelectorAll("span")[1]?.textContent;
        const bookDetail = await getBook(
          courseId!,
          CATEGORY_CODES[category as keyof typeof CATEGORY_CODES],
        );
        const explainPage = await axios.post(
          `https://www.ebsi.co.kr/ebs/lms/lmsx/courseIntro.ajax?courseId=${courseId}&tabNm=intro&callNm=list`,
        );
        const explainData = explainPage.data as string;
        const { document: explainDoc } = parseHTML(explainData);
        const explainList: string[] = [];
        explainDoc
          .querySelectorAll(".cont_para")
          ?.forEach((el) => explainList.push(el.textContent?.trim() ?? ""));
        const explain = explainList.join("\n");

        console.log(
          `강좌 제목: ${title}, 강사: ${instructor}, 교재: ${JSON.stringify(bookDetail)}`,
        );

        const courseDetail: CourseDetail = {
          title,
          instructor,
          explain,
          book: bookDetail,
        };
        const file = Bun.file(`${dir}/${title}.json`, {
          type: "application/json",
        });
        const writer = file.writer();
        await writer.write(JSON.stringify(courseDetail, null, 2));
        await writer.end();
      }
    } catch (e) {
      console.error("강좌 목록 조회 실패", e);
    }
  }
};

testCourseListFetch();
