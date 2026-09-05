"use client";

const UserPageClient = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-start sm:justify-center gap-6 px-4 py-16 sm:gap-8 sm:py-12 md:gap-10 md:py-16">
      <div className="flex justify-center items-center flex-col text-center gap-2 max-w-md">
        <h1 className="text-[32px] font-bold leading-[40px] text-primary sm:text-[40px] sm:leading-[48px] md:text-[48px] md:leading-[56px]">
          Welcome to the Workspace User Page
        </h1>
        <p className="text-sm leading-[22px] text-secondary sm:text-base sm:leading-[24px] md:text-lg md:leading-[28px]">
          This is the workspace page. You can add your content here.
        </p>
      </div>
    </div>
  );
};

export default UserPageClient;
