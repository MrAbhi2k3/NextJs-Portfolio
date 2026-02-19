import React from "react";

const Header = () => {
  return (
    <div className="relative z-40 flex h-7 w-full flex-col shadow-sm sm:h-9">
      <h1 className="fixed left-0 right-0 top-0 flex h-7 items-center justify-center bg-gradient-to-r from-sky-600 via-cyan-500 to-emerald-500 px-3 text-center text-[10px] font-bold text-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 dark:text-slate-100 sm:h-9 sm:text-xs">
        You Can Hire Me! for Frontend, MERN Stack, Graphic Design and Social Handling.
      </h1>
    </div>
  );
};

export default Header;
