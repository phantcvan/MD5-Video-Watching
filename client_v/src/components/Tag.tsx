import React, { useRef, useState, useEffect } from 'react';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';
import { AllTags } from '../static/type';
import "../index.css";

interface TagProp {
  allTags: AllTags[];
  isChoice: string;
  setIsChoice: React.Dispatch<React.SetStateAction<string>>
}

const Tag = ({ allTags, isChoice, setIsChoice }: TagProp) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);


  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      setIsScrolled(container.scrollWidth > container.clientWidth);
    }
  }, []);

  // Hàm xử lý khi nhấp vào nút mũi tên sang phải
  const handleScrollRight = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollLeft += 200; // Điều chỉnh giá trị để thay đổi số lượng cuộn
      setIsScrolled(container.scrollLeft + container.clientWidth < container.scrollWidth);
    }
  };

  // Hàm xử lý khi nhấp vào nút mũi tên sang trái
  const handleScrollLeft = () => {
    const container = containerRef.current;
    if (container) {
      container.scrollLeft -= 200; // Điều chỉnh giá trị để thay đổi số lượng cuộn
      setIsScrolled(container.scrollLeft > 0);
    }
  };


  return (
    <div className='flex max-w-full flex-row mt-2 overflow-x-scroll hide-scrollbar-x text-yt-white gap-3'
     >
      <div
        className={`flex w-fit cursor-pointer hover:bg-yt-light-3 rounded-full p-2`}
        onClick={handleScrollLeft}
      >
        <BsChevronLeft size={20} />
      </div>

      <div className='flex flex-row gap-3 overflow-x-scroll hide-scrollbar-x' ref={containerRef}>
        {allTags?.map((item: AllTags, i: number) => (
          <span className={`min-w-fit px-2 rounded-md py-1 cursor-pointer ${isChoice == item.tag
            ? "text-yt-black bg-yt-white"
            : "text-yt-white bg-yt-light hover:bg-yt-light-1 "
            }`}
            key={i}
            onClick={() => setIsChoice(item.tag)}
          >
            {item.tag}
          </span>
        ))}
      </div>

      {/* Nút mũi tên sang phải */}
      <div
        className="cursor-pointer hover:bg-yt-light-3 rounded-full p-2 z-10 ml-3"
        onClick={handleScrollRight}
      >
        <BsChevronRight size={20} />
      </div>
    </div>
  )
}

export default Tag