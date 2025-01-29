"use client"

import React, { useState } from 'react'
import essaydata from "@/assets/essays.json" 

type Props = {}

export default function page({}: Props) {

  const [visibleCount, setVisibleCount] = useState(20);
  const [selectedSchool, setSelectedSchool] = useState("");

  const filteredEssays = selectedSchool ? essaydata.filter((essay) => essay.school === selectedSchool) : essaydata;

  return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
          <h1 className="text-4xl font-bold mb-4">Previous Essays</h1>
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="mb-4 px-4 py-2 border border-gray-300 rounded"
          >
            <option value="">All Schools</option>
            {Array.from(new Set(essaydata.map((essay) => essay.school))).map(
              (school) => (
                <option key={school} value={school}>
                  {school}
                </option>
              )
            )}
          </select>
          <div className="w-full max-w-4xl">
            {filteredEssays.slice(0, visibleCount).map((essay, index) => (
              <div
                key={index}
                className="mb-6 p-4 bg-white shadow rounded-lg border"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {essay.school} - {essay.prompt}
                </h2>
                <p className="text-gray-700">{essay.essay}</p>
              </div>
            ))}
          </div>
  
          {visibleCount < filteredEssays.length && (
            <button
              onClick={() => setVisibleCount(visibleCount + 20)}
              className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Load More
            </button>
          )}
        </div>
  )
}