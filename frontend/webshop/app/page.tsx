import Image from "next/image";
import Link from "next/link";
import Dropdown from "./components/dropdown";

export default function Home() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: "#E9E6E6" }}>
            <main>
                <div className="flex flex-row mx-auto pe-4 py-8">
                    <div className="shadow-xl basis-1/9 text-lg font-bold text-center text-black">
                        FILTER
                        <Dropdown />
                    </div>
                    <div className="container mx-auto px-4 text-center flex flex-col basis-8/9">
                        <div className="grid grid-cols-6 gap-4 justify-items-center">
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">
                                <Link href="/products/iphone-17-pro-max-2tb" className="block h-full w-full">
                                    <div className="pt-2 text-black font-bold">iPhone 17 Pro Max | 2TB</div>
                                    <Image src="/iPhone_17_Pro_Max.jpg" alt="iPhone 17 Pro Max" width={100} height={100} className="mx-auto mt-2 rounded-xl" />
                                    <div className="text-black">17.999 kr.-</div>
                                </Link>
                            </div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">02</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">03</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">04</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">05</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">06</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">07</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">08</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">09</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">10</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">11</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">12</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">13</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">14</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">15</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">16</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">17</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">18</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">19</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">20</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">21</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">22</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">23</div>
                            <div className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl">24</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
