import { SelectAccessView } from "@/components/view/selectAccessView";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col">
      <header>
        <div className="flex items-center justify-between p-4 bg-secondary text-primary">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="w-6 h-6 bg-primary rounded-full" />
            <span className="text-2xl">BRAND</span>

          </Link>
        </div>
      </header>
      <SelectAccessView />
    </div>
  );
}
