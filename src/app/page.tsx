"use client"

import { useState } from "react";
import AddStudent from "./components/addStudent";
import GetStudents from "./components/getStudents";

export default function Home() {

  const [refreshKey, setRefreshKey] = useState(0);
  const handleStudentAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div>

      <AddStudent onStudentAdded={handleStudentAdded} />
      <GetStudents refreshKey={refreshKey} />
    </div>
  );
}
