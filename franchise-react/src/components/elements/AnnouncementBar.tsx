import { useEffect, useState } from "react";

export default function AnnouncementBar({ announcements }: { announcements: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (announcements.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % announcements.length);
      }, 50000);

      return () => clearInterval(interval);
    }
  }, [announcements]);

  return (
    <div className="fixed top-0 bg-blue left-0 z-10 w-full h-10 p-1 items-center flex justify-center">
      <div className="flex items-center justify-center w-full">
        {announcements[currentIndex].length < 200 ? (
          <AnnouncementMessage text={announcements[currentIndex]} />
        ) : (
          <div className="relative flex overflow-x-hidden">
            <div className="py-12 animate-marquee flex whitespace-nowrap">
              <AnnouncementMessage text={announcements[currentIndex]} />
            </div>
            <div className="absolute top-0 py-12 flex animate-marqueeEnd whitespace-nowrap">
              <AnnouncementMessage text={announcements[currentIndex]} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const AnnouncementMessage = ({ text }: { text: string }) => {
  return (
    <div className="flex items-center">
      <p className="text-white text-sm font-light ">{text}</p>
    </div>
  );
};
