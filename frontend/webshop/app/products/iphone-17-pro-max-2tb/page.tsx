import Image from "next/image";
import Link from "next/link";

const specs = ["lorem ipsum dolor sit amet", "consectetur adipiscing elit", "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua", "ut enim ad minim veniam", "quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"];

export default function Iphone17ProMax2TBPage() {
    return (
        <main className="min-h-screen px-4 py-8 md:px-8" style={{ backgroundColor: "#E9E6E6" }}>
            <div className="mx-auto w-full max-w-6xl rounded-xl bg-neutral-400 p-4 md:p-8">
                <div className="grid gap-8 md:grid-cols-2">
                    <section className="flex flex-col gap-5">
                        <div className="flex h-64 items-center justify-center rounded bg-neutral-300 p-4 md:h-80">
                            <Image src="/iPhone_17_Pro_Max.jpg" alt="iPhone 17 Pro Max 2TB" width={480} height={480} className="max-h-full w-auto object-contain rounded-3xl" priority />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex h-14 items-center justify-center rounded bg-neutral-300 p-2">
                                <Image src="/iPhone_17_Pro_Max.jpg" alt="Front view" width={90} height={60} className="h-full w-auto object-contain" />
                            </div>
                            <div className="flex h-14 items-center justify-center rounded bg-neutral-300 p-2">
                                <Image src="/iPhone_17_Pro_Max.jpg" alt="Back view" width={90} height={60} className="h-full w-auto object-contain" />
                            </div>
                            <div className="flex h-14 items-center justify-center rounded bg-neutral-300 p-2">
                                <Image src="/iPhone_17_Pro_Max.jpg" alt="Side view" width={90} height={60} className="h-full w-auto object-contain" />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button className="rounded-full bg-neutral-300 px-12 py-3 text-3 font-semibold text-black transition hover:bg-neutral-500">Add to cart</button>
                        </div>
                    </section>

                    <section className="flex flex-col gap-5 text-black">
                        <div>
                            <h1 className="text-3xl font-bold">iPhone 17 Pro Max | 2TB</h1>
                            <p className="mt-2 text-2xl">17.999 kr.-</p>
                        </div>

                        <p className="max-w-xl text-lg leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex consequatur libero eum aut cum at eius quae esse ipsam, repellat consectetur maiores molestias similique perferendis, voluptates dolorum! Repudiandae, veritatis exercitationem?</p>

                        <details className="mt-2 rounded bg-neutral-300 text-black" open>
                            <summary className="cursor-pointer list-none px-5 py-3 text-center text-2xl font-medium">
                                <span>Additional Specs</span>
                                <span className="float-right">↓</span>
                            </summary>
                            <div className="border-t border-black/10 px-5 py-4">
                                <ul className="grid gap-2 text-base">
                                    {specs.map((spec) => (
                                        <li key={spec}>{spec}</li>
                                    ))}
                                </ul>
                            </div>
                        </details>

                        <Link href="/" className="w-fit text-sm font-semibold underline-offset-4 hover:underline">
                            Back to products
                        </Link>
                    </section>
                </div>
            </div>
        </main>
    );
}
