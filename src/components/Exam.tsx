import { useEffect, useState } from "react";

interface HelloResponse {
  exampleDate: string;
}

export default function Exam() {
  const [exampleDate, setExampleDate] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:8081/api/hello");
      console.log(res);

      const data: HelloResponse = await res.json();
      setExampleDate(data.exampleDate);
    };
    fetchData();
  }, []);

  return (
    <>
      <div>
        <h1>Backend에서 가져온 데이터: {exampleDate}</h1>
      </div>
    </>
  );
}
