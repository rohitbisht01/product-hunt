import { SearchIcon } from "lucide-react";
import React from "react";

export default function Search() {
  return (
    <div className="rounded-full p-2 bg-gray-100 text-gray-500 flex items-center ml-4 relative gap-2 ">
      <SearchIcon className="ml-2" size={18} />
      <input
        type="text"
        placeholder="Search ( ctrl + k )"
        className="focus:outline-none bg-gray-100"
      />
    </div>
  );
}
