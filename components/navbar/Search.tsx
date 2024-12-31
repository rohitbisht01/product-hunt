"use client";

import { searchProducts } from "@/lib/server-actions";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Product {
  id: string;
  name: string;
  slug: string;
  headline: string;
  description: string;
  logo: string;
  releaseDate: string;
  website: string;
  twitter: string;
  discord: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  status: string;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setQuery(inputValue);
    if (inputValue.trim() !== "") {
      const products: Product[] = await searchProducts(inputValue);

      const activeProducts = products.filter(
        (product) => product.status === "ACTIVE"
      );
      setSearchResults(activeProducts);
      setIsDropdownVisible(true);
    } else {
      setSearchResults([]);
      setIsDropdownVisible(false);
    }
  };

  const handleItemClick = (slug: string, productName: string) => {
    setQuery(productName);
    setIsDropdownVisible(false);
    router.push(`/product/${slug}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="rounded-full p-2 bg-gray-100 text-gray-500 flex items-center ml-4 relative gap-2 ">
      <SearchIcon className="ml-2" size={18} />
      <input
        type="text"
        placeholder="Search..."
        className="p-2 rounded-full text-xs focus:outline-none bg-gray-100"
        value={query}
        onChange={handleSearch}
        ref={searchInputRef}
      />
      {isDropdownVisible && searchResults.length > 0 && (
        <ul className="absolute top-full bg-gray-100  rounded-md border mt-2 w-full">
          {searchResults.map((product) => (
            <li
              key={product.id}
              className="p-2 hover:bg-gray-100 cursor-pointer text-sm flex items-center gap-x-2"
              onClick={() => handleItemClick(product.slug, product.name)}
            >
              <Image
                src={product.logo}
                alt="logo"
                width={50}
                height={50}
                className="rounded-md h-8 w-8"
              />
              {product.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
