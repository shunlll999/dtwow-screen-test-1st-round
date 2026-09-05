'use client';

import { useRouter } from "next/navigation";
import { AdminIcon, UserBubbleIcon } from "../icons";
import { ButtonView } from "../ui";

export const SelectAccessView = () => {
  const router = useRouter();
  return (
    <main className="flex-1 flex flex-col items-center justify-start sm:justify-center gap-6 px-4 py-16 sm:gap-8 sm:py-12 md:gap-10 md:py-16">
      <div className="flex justify-center items-center flex-col text-center gap-2 max-w-md">
        <h1 className="text-2xl font-semibold leading-tight sm:text-3xl sm:whitespace-nowrap md:text-4xl lg:text-5xl">
          Select Access Level
        </h1>
        <div className="text-sm text-muted-foreground sm:text-base">
          Lorem ipsum dolor sit amet consectetur. Elit purus nam.
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full max-w-sm sm:flex-row sm:gap-6 sm:max-w-3xl">
        <div className="items-center justify-between flex flex-col rounded-[10px] w-full bg-secondary sm:flex-1 sm:aspect-[581/619] p-6 sm:p-8 md:p-10 shadow-[0px_4px_22px_0px_rgba(0,0,0,0.05)]">
          <div className="justify-between flex-1 w-full flex flex-col items-start justify-around gap-2 sm:aspect-[381/279]">
            <UserBubbleIcon />
            <span className="font-semibold text-primary text-2xl sm:text-3xl md:text-4xl">
              User
            </span>
            <div className="text-primary text-muted-foreground text-sm sm:text-base">
              Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida
              porttitor nibh urna sit ornare a. Proin dolor morbi id ornare
              aenean non
            </div>
          </div>
          <ButtonView
            text="Enter Workspace"
            color="primary"
            onClick={() => router.push("/workspace")}
          />
        </div>
        <div className="items-center justify-between flex flex-col rounded-[10px] w-full bg-primary sm:flex-1 sm:aspect-[581/619] p-6 sm:p-8 md:p-10 shadow-[0px_4px_22px_0px_rgba(0,0,0,0.05)]">
          <div className="justify-between flex-1 w-full flex flex-col items-start justify-around gap-2 sm:aspect-[381/279]">
            <AdminIcon />
            <span className="font-semibold text-secondary text-2xl sm:text-3xl md:text-4xl">
              Administrator
            </span>
            <span className="text-secondary text-muted-foreground text-sm sm:text-base">
              Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida
              porttitor nibh urna sit ornare a. Proin dolor morbi id ornare
              aenean non
            </span>
          </div>
          <ButtonView
            text="Enter Portal"
            color="secondary"
            onClick={() => router.push("/workspace")}
          />
        </div>
      </div>
    </main>
  );
};
