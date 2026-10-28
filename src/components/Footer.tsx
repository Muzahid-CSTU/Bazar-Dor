import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t-[3px] border-[#e7eee7] bg-[#fbfdfb]">
      <div className="mx-auto flex min-h-[44px] max-w-6xl flex-col items-center justify-between gap-2 px-4 py-3 text-center sm:flex-row sm:gap-4 sm:px-5 sm:text-left">
        <p className="text-[10px] leading-4 text-[#59635b]">
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>

        <p className="text-[10px] leading-4 text-[#59635b]">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
};

export default Footer;