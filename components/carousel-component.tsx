import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

interface CarouselComponentProps {
  productImages: string[];
}

const CarouselComponent = ({ productImages }: CarouselComponentProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full overflow-hidden md:overflow-visible"
    >
      <CarouselContent>
        {Array.from({
          length: productImages.length,
        }).map((_, index) => (
          <CarouselItem key={index} className="basis-1/2">
            <Image
              src={productImages[index]}
              alt="product-images"
              width={500}
              height={500}
              className="rounded-md object-cover border border-gray-200 h-60 w-full"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default CarouselComponent;
