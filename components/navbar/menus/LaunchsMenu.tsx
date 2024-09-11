import React from "react";

const items = [
  {
    icon: "🚀",
    title: "Coming Soon",
    description: "Exciting new launches ahead.",
  },
  {
    icon: "📂",
    title: "Launch Archive",
    description: "Browse past product launches.",
  },
  {
    icon: "📖",
    title: "Launch Guide",
    description: "Step-by-step guide to launch.",
  },
];

export default function LaunchsMenu() {
  return (
    <div className="border rounded-sm shadow-sm bg-white absolute top-full text-gray-700">
      <div className="flex cursor-pointer p-4">
        <div className="flex flex-col items-start space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="bg-white p-1 rounded-sm shadow-sm">
                {item.icon}
              </div>
              <div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm w-60">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
