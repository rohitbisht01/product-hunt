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
import { TbWorldCheck } from "react-icons/tb";
import { FaTwitter } from "react-icons/fa";
import { FaDiscord } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { createProduct } from "@/lib/server-actions";

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
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
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
  const [website, setWebsite] = useState("");
  const [twitter, setTwitter] = useState("");
  const [discord, setDiscord] = useState("");

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

  const handleWebsiteChange = (e: any) => {
    setWebsite(e.target.value);
  };

  const handleTwitterChange = (e: any) => {
    setTwitter(e.target.value);
  };

  const handleDiscordChange = (e: any) => {
    setDiscord(e.target.value);
  };

  const handleGoToProducts = () => {
    window.location.href = "/my-products";
  };

  const submitAnotherProducts = () => {
    setStep(1);
    setName("");
    setSlug("");
    setShortDescription("");
    setHeadline("");
    setDate(new Date());
    setWebsite("");
    setTwitter("");
    setDiscord("");
    setSelectedCategories([]);
    setUploadedLogoUrl("");
    setUploadedProductImages([]);
  };

  const submitProduct = async () => {
    setLoading(true);
    const formattedDate = date ? format(date, "MM/dd/yyyy") : "";

    try {
      await createProduct({
        name,
        slug,
        headline,
        website,
        twitter,
        discord,
        description: shortDescription,
        logo: uploadedLogoUrl,
        releaseDate: formattedDate,
        images: uploadedProductImages,
        category: selectedCategories,
      });

      setStep(8);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const nextStep = useCallback(() => {
    setStep(step + 1);
  }, [step]);

  const prevStep = useCallback(() => {
    setStep(step - 1);
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

        {step === 6 && (
          <div className="space-y-10">
            <h1 className="text-4xl font-semibold">🔗 Additional Links</h1>
            <p className="text-xl font-light mt-4 leading-8">
              Add links to your product&apos;s website, social media, and other
              platforms
            </p>

            <div className="mt-10">
              <div className="font-medium flex items-center gap-x-2">
                <TbWorldCheck className="text-2xl text-gray-600" />
                <span>Website</span>
              </div>
              <input
                type="text"
                value={website}
                className="border rounded-md p-2 w-full mt-2 focus:outline-none"
                placeholder="https://www.yourdomain.com"
                onChange={handleWebsiteChange}
              />
            </div>

            <div className="mt-10">
              <div className="font-medium flex items-center gap-x-2">
                <FaTwitter className="text-2xl text-gray-600" />
                <span>Twitter</span>
              </div>
              <input
                type="text"
                value={twitter}
                className="border rounded-md p-2 w-full mt-2 focus:outline-none"
                placeholder="https://twitter.com/yourusername"
                onChange={handleTwitterChange}
              />
            </div>

            <div className="mt-10">
              <div className="font-medium flex items-center gap-x-2">
                <FaDiscord className="text-2xl text-gray-600" />
                <span>Discord</span>
              </div>
              <input
                type="text"
                value={discord}
                className="border rounded-md p-2 w-full mt-2 focus:outline-none"
                placeholder="https://discord.com/users/yourusername"
                onChange={handleDiscordChange}
              />
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-10">
            {/* <Progress value={100}/> */}

            <h1 className="text-4xl font-semibold">🔍 Review and Submit</h1>
            <div className="text-xl font-light mt-4 leading-8">
              Review the details of your project and submit it to the world.
              Your product will be reviewed by our team before it goes live.
            </div>

            <div className="mt-10 grid grid-cols-2 gap-8">
              {/* <div>
                <div className="font-semibold">Logo</div>
                <Image
                  src={uploadedLogoUrl || ""}
                  alt="Product Logo"
                  width={1000}
                  height={1000}
                  className="rounded-md w-28 h-28 object-cover"
                />
              </div> */}

              <div>
                <div className="font-semibold">Name of the product</div>
                <div className="mt-2 text-gray-600">{name}</div>
              </div>

              <div>
                <div className="font-semibold">Slug ( URL )</div>
                <div className="mt-2 text-gray-600">{slug}</div>
              </div>

              <div>
                <div className="font-semibold">Category</div>
                <div className="mt-2 text-gray-600">
                  {selectedCategories.join(", ")}
                </div>
              </div>

              <div>
                <div className="font-semibold">Website URL</div>
                <div className="mt-2 text-gray-600">{website}</div>
              </div>

              <div>
                <div className="font-semibold">Headline</div>
                <div className="mt-2 text-gray-600">{headline}</div>
              </div>

              <div>
                <div className="font-semibold">Short Descrition</div>
                <div className="mt-2 text-gray-600">{shortDescription}</div>
              </div>

              <div>
                <div className="font-semibold">Twitter</div>
                <div className="mt-2 text-gray-600">{twitter}</div>
              </div>

              <div>
                <div className="font-semibold">Discord</div>
                <div className="mt-2 text-gray-600">{discord}</div>
              </div>

              <div>
                <div className="font-semibold">
                  Release date - Pending Approval
                </div>
                <div className="mt-2 text-gray-600">
                  {date ? date.toDateString() : "Not specified"}
                </div>
              </div>

              <div className="cols-span-2">
                <div className="font-semibold">Product Images</div>
                <div className="mt-2 md:flex gap-2 w-full">
                  {uploadedProductImages.map((url, index) => (
                    <div key={index} className="relative w-28 h-28">
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
              </div>
            </div>
          </div>
        )}

        {step === 8 && (
          <div className="space-y-10">
            <div className="text-4xl font-semibold">Congratulations 👏</div>
            <div className="text-xl font-light mt-4 leading-8">
              Your product has been successfully submitted. Our team will review
              it and get back to you soon.
            </div>

            <div className="flex flex-col gap-4">
              <div
                className="bg-orange-600 text-white py-2 px-4 rounded-md flex w-60 justify-center items-center cursor-pointer"
                onClick={handleGoToProducts}
              >
                Go to your products
              </div>
              <Separator />

              <div
                className="text-orange-600  py-2 px-4 rounded-md flex w-60 justify-center items-center cursor-pointer"
                onClick={submitAnotherProducts}
              >
                Submit another product
              </div>
            </div>
          </div>
        )}

        {step !== 8 && (
          <>
            <div className="flex justify-between items-center mt-10">
              {step !== 1 && (
                <button className="text-gray-600" onClick={prevStep}>
                  Previous
                </button>
              )}

              <div className="flex items-center">
                {step === 7 ? (
                  <button
                    className="bg-orange-600 text-white py-2 px-4 mt-4 rounded-md items-end"
                    onClick={submitProduct}
                  >
                    Submit
                  </button>
                ) : (
                  <button
                    className="bg-orange-600 text-white py-2 px-4 mt-4 rounded-md items-end"
                    onClick={nextStep}
                  >
                    {step === 7 ? "Submit" : "Continue"}
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NewProduct;
