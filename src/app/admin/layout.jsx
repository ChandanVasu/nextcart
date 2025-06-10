import SideBar from "@/components/admin/SideBar";
import Header from "@/components/admin/Header";

export default function layout({ children }) {
  return (
    <div>
      <Header />
      <div className="flex bg-gray-50 min-h-[calc(100vh-40px)]">
        <div className="w-[260px] px-5 hidden md:block bg-stone-100 h-screen fixed top-12 left-0 rounded-md py-4">
          <SideBar />
        </div>
        <div className="ml-0 md:ml-[270px] w-full">
          <div className="mt-0 px-5"></div>
          {children}
        </div>
      </div>
    </div>
  );
}
