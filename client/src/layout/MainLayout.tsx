import { Outlet } from "react-router";
// import Navbar from "@/components/Navbar";
import LeftSidebar from "@/layout/components/LeftSidebar";
import RightSidebar from "@/layout/components/RightSidebar";
import { Group, Panel, Separator } from "react-resizable-panels";

export default function MainLayout() {
  return (
    <div className="h-screen bg-black text-white flex flex-col">
      <Group orientation="horizontal" className="flex-1 flex h-full p-2">
        {/* LEFT */}
        <Panel defaultSize="30%" maxSize="40%" minSize="20%">
          <LeftSidebar />
        </Panel>

        <Separator className="w-0.5 bg-black rounded-md transition-colors" />

        {/* MAIN */}
        <Panel defaultSize="60%">
          <div className="m-1">
            {/* <Navbar /> */}
            <Outlet />
          </div>
        </Panel>

        <Separator className="w-1 bg-black rounded-md transition-colors" />

        {/* RIGHT */}
        <Panel defaultSize="15%" minSize="20%" maxSize="40%">
          <div className="m-1 rounded-sm bg-zinc-900 h-[calc(100vh-130px)]">
            <RightSidebar />
          </div>
        </Panel>
      </Group>
      <div className="bg-zinc-900 rounded-sm mx-3 mt-1.5 h-26"></div>
    </div>
  );
}
