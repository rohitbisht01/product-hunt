"use client";

import ImagesUploader from "@/components/ImagesUploader";
import LogoUploader from "@/components/LogoUploader";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const categories = [
  "Media",
  "Cloud",
  "Blockchain",
  "Education",
  "E-commerce",
  "Health",
  "Social",
  "Fitness",
  "Sales",
  "Engineering",
  "Finance",
  "Gaming",
  "Travel",
  "Real Estate",
  "Automotive",
  "Retail",
  "Entertainment",
  "Legal",
  "Hospitality",
  "Technology",
  "Manufacturing",
  "Telecommunications",
  "Non-Profit",
  "Government",
  "Pharmaceuticals",
  "Agriculture",
  "Construction",
];

const NewProduct = () => {
  const [step, setStep] = useState(4);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [shortDescription, setShortDescription] = useState("");
  const [headline, setHeadline] = useState("");
  const [uploadedLogoUrl, setUploadedLogoUrl] = useState<string>("");
  const [uploadedProductImages, setUploadedProductImages] = useState<string[]>(
    []
  );
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleNameChange = (e: any) => {
    const productName = e.target.value;
    const truncatedName = productName.slice(0, 30);
    setName(truncatedName);

    // create slug from product name
    const slugValue = truncatedName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/\./g, "-");
    setSlug(slugValue);
  };

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories((prevCategories) =>
        prevCategories.filter((item) => item !== category)
      );
    } else if (selectedCategories.length < 3) {
      setSelectedCategories((prevCategories) => [...prevCategories, category]);
    }
  };

  const handleDescriptionChange = (e: any) => {
    setShortDescription(e.target.value.slice(0, 300));
  };

  const handleHeadlineChange = (e: any) => {
    const headlineText = e.target.value.slice(0, 70);
    setHeadline(headlineText);
  };

  const handleLogoUpload = useCallback((url: any) => {
    setUploadedLogoUrl(url);
  }, []);

  const handleProductImagesUpload = useCallback((urls: string[]) => {
    setUploadedProductImages(urls);
  }, []);

  const nextStep = useCallback(() => {
    setStep(step + 1);
  }, [step]);

  return (
    <div className="flex items-center justify-center py-8 md:py-20">
      <div className="px-8 md:3/5 md:mx-auto">
        {step === 1 && (
          <div className="space-y-10">
            <h1 className="text-4xl font-semibold">📦 New Product</h1>
            <p className="text-xl font-light mt-4 leading-8">
              Ready to showcase your product to the world? You came to the right
              place. Follow the steps below to get started.
            </p>

            <div className="mt-10">
              <h2 className="font-medium">Name of the product</h2>
              <input
                type="text"
                value={name}
                onChange={handleNameChange}
                maxLength={30}
                className="border rounded-md p-2 w-full mt-2 focus:outline-none"
              />

              <div className="text-sm text-gray-500 mt-1">
                {name.length} / 30
              </div>
            </div>

            <div className="mt-10">
              <h2 className="font-medium">
                Slug (URL) - This will be used to create a unique URL for your
                product
              </h2>
              <input
                type="text"
                value={slug}
                className="border rounded-md p-2 w-full mt-2 focus:outline-none"
                readOnly
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-10">
            <h1 className="text-4xl font-semibold">
              📊 What category does your product belongs to ?
            </h1>
            <p className="text-xl font-light mt-4 leading-8">
              Choose at least 3 categories that best your fits your product.
              This will people discover your product
            </p>
            <div className="mt-10">
              <h2 className="font-medium">Select Categories</h2>
              <div className="grid grid-cols-4 gap-2 pt-4 items-center justify-center">
                {categories.map((category, index) => {
                  return (
                    <div
                      key={index}
                      className="flex border rounded-full"
                      onClick={() => handleCategoryToggle(category)}
                    >
                      <div
                        className={`text-sm md:text-sm p-2 cursor-pointer w-full text-center ${
                          selectedCategories.includes(category)
                            ? "bg-red-600 text-white rounded-full"
                            : "text-black"
                        }`}
                      >
                        {category}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-10">
            <h1 className="text-4xl font-semibold">ℹ️ Product Details</h1>
            <p className="text-xl font-light mt-4 leading-8">
              Keep it simple and clear. Describe your product in a way that
              makes it easy for people to understand what it does.
            </p>
            <div className="mt-10">
              <h2 className="font-medium">Headline</h2>
              <input
                type="text"
                value={headline}
                onChange={handleHeadlineChange}
                className="border rounded-md p-2 w-full mt-2 focus:outline-none"
              />
              <div className="text-sm text-gray-500 mt-1">
                {headline.length} / 70
              </div>
            </div>

            <div className="mt-10">
              <h2 className="font-medium">Short Description</h2>
              <textarea
                value={shortDescription}
                onChange={handleDescriptionChange}
                className="border rounded-md p-2 w-full mt-2 focus:outline-none"
                rows={8}
                maxLength={300}
              />
              <div className="text-sm text-gray-500 mt-1">
                {shortDescription.length} / 300
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-10">
            <h1 className="text-4xl font-semibold">
              🖼️ Add Images to showcase your project
            </h1>
            <p className="text-xl font-light mt-4 leading-8">
              Include images that best represent your product, This will help
              people understand what your product looks like.{" "}
            </p>

            <div className="mt-10">
              <h2 className="font-medium">Logo</h2>
              {uploadedLogoUrl ? (
                <div>
                  <Image
                    src={uploadedLogoUrl}
                    alt="logo"
                    height={1000}
                    width={1000}
                    className="rounded-md h-4 w-40 object-cover"
                  />
                </div>
              ) : (
                <LogoUploader
                  endpoint="productLogo"
                  onChange={handleLogoUpload}
                />
              )}
            </div>

            <div className="mt-10">
              <h2 className="font-medium">
                Product Images (upload atleast 3 images)
              </h2>
              {uploadedProductImages.length > 0 ? (
                <div className="mt-2 md:flex gap-2 space-y-4 md:space-y-0">
                  {uploadedProductImages.map((url, index) => (
                    <div key={index} className="relative md:w-40 h-40">
                      <Image
                        priority
                        src={url}
                        alt="Uploaded Product Image"
                        layout="fill"
                        objectFit="cover"
                        className="rounded-md"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <ImagesUploader
                  endpoint="productImages"
                  onChange={handleProductImagesUpload}
                />
              )}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-10">
            <h1 className="text-4xl font-semibold">📅 Release Date</h1>
            <p className="text-xl font-light mt-4 leading-8">
              When will your product be available to the public? Select a date
              to continue.
            </p>

            <div className="mt-10">
              <div className="font-medium pb-3">Release Date</div>
              <>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[300px] pl-3 text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                      <CalendarDays className="ml-auto h-4 w-4 opaciy-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => setDate(date)}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </>
            </div>
          </div>
        )}

        <button className="mt-20" onClick={nextStep}>
          Next
        </button>
      </div>
    </div>
  );
};

export default NewProduct;
