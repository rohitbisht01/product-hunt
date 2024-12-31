"use client"

interface GoToWebsiteProps {
  website: string;
}

const GoToWebsite = ({ website }: GoToWebsiteProps) => {
  return (
    <div  onClick={() => window.open(website, "_blank")}
    className="hidden lg:flex hover:underline cursor-pointer"
    >
     Go to website
    </div>)
};

export default GoToWebsite;
