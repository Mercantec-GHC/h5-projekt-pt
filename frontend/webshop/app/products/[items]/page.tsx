"use client";

import Image from "next/image";
import Link from "next/link";
import Cookies from "universal-cookie";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useCart } from "../../components/cart-context";

// Dummy specs
const specs = ["lorem ipsum dolor sit amet", "consectetur adipiscing elit", "sed do eiusmod tempor incididunt ut labore et dolore magna aliqua", "ut enim ad minim veniam", "quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"];

export default function ProductPage() {
    const { items } = useParams();
    const { addItem } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const cookies = new Cookies();

    // Show a toast notification
    function showToast(message: any, color: any) {
        const toast = document.getElementById("toast");
        if (!toast) return;

        toast.textContent = String(message);

        toast.classList.add("show");
        toast.style.backgroundColor = color || "";

        setTimeout(() => {
            toast.classList.remove("show");
        }, 3000);
    }

    // Adding item to cart
    function handleAddToCart() {
        if (!cookies.get("session")) {
            showToast("You must be logged in to add items to the cart.", "#ff0000");
            return;
        } else {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price + " kr.-",
                image: "/placeholder.jpg",
            });
            showToast("Item added to cart!", "#06be06");
        }
    }

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch("http://localhost:4000/getProducts");
                const products = await res.json();

                const found = products.find((p: { id: any; name: any }) => `${p.id}-${p.name}`.toLowerCase().trim().replace(/\s+/g, "-") === items);

                setProduct(found || null);
            } catch {
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [items]);

    if (loading)
        return (
            <div className="min-h-screen text-center py-16 text-black" style={{ backgroundColor: "#E9E6E6" }}>
                Loading...
            </div>
        );
    if (!product)
        return (
            <div className="min-h-screen text-center py-16 text-black" style={{ backgroundColor: "#E9E6E6" }}>
                Product not found
            </div>
        );

    return (
        <main className="min-h-screen px-4 py-8 md:px-8" style={{ backgroundColor: "#E9E6E6" }}>
            <div className="mx-auto w-full max-w-6xl rounded-xl bg-neutral-400 p-4 md:p-8">
                <div className="grid gap-8 md:grid-cols-2">
                    <section className="flex flex-col gap-5">
                        <div className="flex h-64 items-center justify-center rounded bg-neutral-300 p-4 md:h-80">
                            <Image src="/placeholder.jpg" alt="iPhone 17 Pro Max 2TB" width={480} height={480} className="max-h-full w-auto object-contain rounded-3xl" priority />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="flex h-14 items-center justify-center rounded bg-neutral-300 p-2">
                                <Image src="/placeholder.jpg" alt="Back view" width={90} height={60} className="h-full w-auto object-contain" />
                            </div>
                            <div className="flex h-14 items-center justify-center rounded bg-neutral-300 p-2">
                                <Image src="/placeholder.jpg" alt="Front view" width={90} height={60} className="h-full w-auto object-contain" />
                            </div>
                            <div className="flex h-14 items-center justify-center rounded bg-neutral-300 p-2">
                                <Image src="/placeholder.jpg" alt="Side view" width={90} height={60} className="h-full w-auto object-contain" />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button onClick={() => handleAddToCart()} className="rounded-full bg-neutral-300 px-12 py-3 text-3 font-semibold text-black transition hover:bg-neutral-500">
                                Add to cart
                            </button>
                        </div>
                    </section>

                    <section className="flex flex-col gap-5 text-black">
                        <div>
                            <h1 className="text-3xl font-bold">{product.name}</h1>
                            <p className="mt-2 text-2xl">{product.price} kr.-</p>
                            <p className="text-lg font-medium">{product.amountAvailable} in stock</p>
                        </div>

                        <p className="max-w-xl text-lg leading-relaxed">{product.description || "No description available."}</p>

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
            <div id="toast" className="toast-default"></div>
        </main>
    );
}
