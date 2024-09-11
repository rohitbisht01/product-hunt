import React from "react";

const items = [
  {
    title: "About Us",
  },
  {
    title: "Careers",
  },
  {
    title: "Apps",
  },
  {
    title: "FAQs",
  },
];

export default function AboutMenu() {
  return (
    <div className="w-32 border-gray-200 rounded-sm shadow-md bg-white absolute text-gray-600 top-full">
      <ul className="flex flex-col items-start p-4 space-y-2 cursor-pointer">
        {items.map((item, index) => (
          <div key={index} className="flex">
            <div className="text-sm">{item.title}</div>
          </div>
        ))}
      </ul>
    </div>
  );
}
