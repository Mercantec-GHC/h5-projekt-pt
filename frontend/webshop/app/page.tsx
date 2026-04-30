"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Dropdown from "./components/dropdown";

type Product = {
    id: number | string;
    name: string;
    description?: string;
    price: number;
};

type MappedProduct = Product & {
    items: string;
};

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        let ignore = false;

        // Fetch products from the backend API
        const fetchProducts = async () => {
            try {
                const response = await fetch("http://localhost:4000/getProducts");
                if (!response.ok) {
                    console.error("Failed to fetch products:", response.statusText);
                    return;
                }

                const data: Product[] = await response.json();
                if (!ignore) {
                    setProducts(data);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            }
        };

        fetchProducts();

        return () => {
            ignore = true;
        };
    }, []);

    // Map products
    const mappedProducts = useMemo<MappedProduct[]>(
        () =>
            products.map((product) => ({
                ...product,
                items: `${product.id}-${product.name}`
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, "-"),
            })),
        [products],
    );

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
                                    <Image
                                        src="/iPhone_17_Pro_Max.jpg"
                                        alt="iPhone 17 Pro Max"
                                        width={100}
                                        height={100}
                                        className="mx-auto mt-2 rounded-xl"
                                        loading="eager"
                                    />
                                    <div className="text-black">17.999 kr.-</div>
                                </Link>
                            </div>

                            {mappedProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-neutral-400 rounded-lg w-50 h-50 transition-transform duration-200 ease-out hover:scale-110 hover:shadow-2xl"
                                >
                                    <Link
                                        href={`/products/${product.items}`}
                                        className="flex h-full w-full flex-col justify-center px-4 py-2"
                                    >
                                        <div className="pt-2 text-black font-bold line-clamp-2">{product.name}</div>
                                        <Image
                                        src="/placeholder.jpg"
                                        alt="placeholder image"
                                        width={100}
                                        height={100}
                                        className="mx-auto mt-2 rounded-xl"
                                        loading="eager"
                                    />
                                        <div className="text-black">{product.price} kr.-</div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}