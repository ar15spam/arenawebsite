"use client";

import React, { useState, useEffect } from "react";
import { getClasses } from "@/app/portal/[...userId]/actions";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

type Class = {
  id: string;
  name: string;
  isPrivate: boolean;
  counselorId: string;
  data: ClassData;
  updatedAt: Date; 
};

type ClassData = {
  syllabus: string;
  resources: { name: string; link: string }[];
};

const isClassType = (data: any): data is Class => {
  return (
    data &&
    typeof data.id === "string" &&
    typeof data.name === "string" &&
    typeof data.isPrivate === "boolean" &&
    typeof data.counselorId === "string" &&
    data.updatedAt instanceof Date &&
    isClassData(data.data)
  );
};

const isClassData = (data: any): data is ClassData => {
  return (
    data &&
    typeof data.syllabus === "string" &&
    Array.isArray(data.resources) &&
    data.resources.every(
      (resource: any) =>
        resource &&
        typeof resource.name === "string" &&
        typeof resource.link === "string"
    )
  );
};

const Classes = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const response = await getClasses();
        if (response?.classesData) {
          const validClasses = response.classesData.filter(isClassType);
          setClasses(validClasses);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchClasses();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Classes</h1>
  
      {loading ? (
        <p>Loading...</p>
      ) : classes.length === 0 ? (
        <p className="text-gray-500 italic">No classes available...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => (
            <Card
              key={cls.id}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedClass(cls)}
            >
              <CardHeader>
                <CardTitle>{cls.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
  
      {selectedClass && (
        <div className="mt-6 p-4 border rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-semibold">{selectedClass.name}</h2>
          <p className="mt-2">
            <strong>Syllabus:</strong> {selectedClass.data.syllabus}
          </p>
          <h3 className="mt-4 font-semibold">Resources:</h3>
          <ul className="list-disc pl-5">
            {selectedClass.data.resources.map((resource, index) => (
              <li key={index}>
                <a
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {resource.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Classes;