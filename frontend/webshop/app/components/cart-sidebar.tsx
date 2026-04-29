"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { useCart } from "./cart-context";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import mqtt, { MqttClient } from "mqtt";

// Parse dot and comma prices
const parseCartPrice = (price: string | number) => {
    if (typeof price === "number" && Number.isFinite(price)) {
        return price;
    }

    let normalized = String(price)
        .trim()
        .replace(/[^\d.,]/g, "");
    if (!normalized) {
        return 0;
    }

    const hasComma = normalized.includes(",");
    const hasDot = normalized.includes(".");

    if (hasComma && hasDot) {
        if (normalized.lastIndexOf(",") > normalized.lastIndexOf(".")) {
            normalized = normalized.replace(/\./g, "").replace(",", ".");
        } else {
            normalized = normalized.replace(/,/g, "");
        }
    } else if (hasComma) {
        const parts = normalized.split(",");
        if (parts.length === 2 && parts[1].length <= 2) {
            normalized = `${parts[0]}.${parts[1]}`;
        } else {
            normalized = normalized.replace(/,/g, "");
        }
    } else if (hasDot) {
        const parts = normalized.split(".");
        if (!(parts.length === 2 && parts[1].length <= 2)) {
            normalized = normalized.replace(/\./g, "");
        }
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
};

// Sidebar
const CartSidebar = () => {
    const { closeCart, isOpen, items, clearCart, checkout, resetCheckout, isCheckoutPending, checkoutError } = useCart();
    const [mqttConnected, setMqttConnected] = useState(false);
    const clientRef = useRef<MqttClient | null>(null);
    const [checkoutSuccess, setCheckoutSuccess] = useState(false);
    const [receipt, setReceipt] = useState<null | { timestamp: number; nfc_uid: string; items: any[]; total: number }>(null);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    function sendReceiptToServer(data: any) {
        fetch(`http://localhost:4000/purchase`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        console.log("Receipt sent to server:", data);
    }

    const disconnectMQTT = () => {
        if (clientRef.current) {
            try {
                clientRef.current.end();
            } catch (e) {
                console.error("Error disconnecting MQTT client:", e);
            }
            clientRef.current = null;
        }
        setMqttConnected(false);
    };

    useEffect(() => {
        setPortalTarget(document.body);
    }, []);

    useEffect(() => {
        if (!isCheckoutPending) return;

        const connectMQTT = async () => {
            try {

                const client = mqtt.connect(`wss://231bdedf95bd46d4a1651323d0b91949.s1.eu.hivemq.cloud:8884/mqtt`, {
                    protocol: "wss",
                    clientId: `webshop-client`,
                    clean: true,
                    connectTimeout: 30000,
                    keepalive: 30,
                    username: "admin",
                    password: "PhamiErSej1",
                });

                clientRef.current = client;

                client.on("connect", () => {
                    setMqttConnected(true);
                    client.subscribe("OLC-Data", (err) => {
                        if (err) {
                            console.error("Failed to subscribe to NFC topic", err);
                            setMqttConnected(false);
                        }
                    });
                });

                client.on("message", (topic: string, message: Buffer) => {
                    if (topic === "OLC-Data") {
                        const payloadStr = message.toString();
                        try {
                            const data = JSON.parse(payloadStr);
                            approveDeal(data);
                        } catch (err) {
                            console.error("Invalid NFC payload", err);
                            approveDeal(null as any);
                        }
                    }
                });

                client.on("error", (error) => {
                    console.error("MQTT connection error:", error);
                    setMqttConnected(false);
                });

                client.on("disconnect", () => {
                    setMqttConnected(false);
                });
            } catch (error) {
                console.error("Failed to connect to MQTT broker:", error);
                setMqttConnected(false);
            }
        };

        connectMQTT();

        return () => {
            disconnectMQTT();
        };
    }, [isCheckoutPending]);

    const approveDeal = async (data?: { timestamp?: number; nfc_uid?: string } | null) => {
        try {
            setCheckoutSuccess(true);

            const itemsSnapshot = items.map((it) => ({ ...it }));
            const total = itemsSnapshot.reduce((s, it) => s + parseCartPrice(it.price) * (it.quantity || 1), 0);
            const purchaseItems = itemsSnapshot.map((item) => ({
                productId: item.id,
                amountBought: item.quantity || 1,
            }));

            const ts = data && typeof data.timestamp === "number" ? data.timestamp : Math.floor(Date.now() / 1000);
            const uid = data && typeof data.nfc_uid === "string" ? data.nfc_uid.trim() : "unknown";

            setReceipt({ timestamp: ts, nfc_uid: uid, items: itemsSnapshot, total });
            sendReceiptToServer({ items: purchaseItems });
            clearCart();
            resetCheckout();
            disconnectMQTT();
            closeCart();
        } catch (error) {
            console.error("Error approving deal:", error);
            setCheckoutSuccess(false);
        }
    };

    // Receipt modal
    const receiptModal =
        receipt && portalTarget
            ? createPortal(
                  <div className="fixed inset-0 z-50 flex items-center justify-center px-4 text-black">
                      <div className="absolute inset-0 bg-black/50" />
                      <div className="relative z-60 w-11/12 max-w-md rounded-lg bg-white p-6 shadow-lg text-black">
                          <h3 className="mb-2 text-xl font-bold text-black">Receipt</h3>
                          <p className="text-sm text-black">
                              Card ID: <span className="font-mono text-black">{receipt.nfc_uid}</span>
                          </p>
                          <p className="text-sm text-black">
                              Time: <span className="font-medium text-black">{new Date(receipt.timestamp * 1000).toLocaleString()}</span>
                          </p>

                          <div className="mt-4 max-h-44 overflow-y-auto text-black">
                              {receipt.items.map((it, idx) => (
                                  <div key={idx} className="flex justify-between py-1 text-black">
                                      <div>
                                          <div className="font-semibold text-black">{it.name}</div>
                                          <div className="text-xs text-black">Qty: {it.quantity}</div>
                                      </div>
                                      <div className="text-sm text-black">{it.price}</div>
                                  </div>
                              ))}
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t pt-3 text-black">
                              <div className="font-semibold text-black">Total</div>
                              <div className="font-semibold text-black">{receipt.total} kr.-</div>
                          </div>

                          <div className="mt-4 flex gap-3">
                              <button
                                  onClick={() => {
                                      setReceipt(null);
                                      setCheckoutSuccess(false);
                                  }}
                                  className="flex-1 rounded-lg bg-green-500 px-4 py-2 font-bold text-black transition hover:bg-green-600"
                              >
                                  Done
                              </button>
                              <button
                                  onClick={() => {
                                      setReceipt(null);
                                      setCheckoutSuccess(false);
                                  }}
                                  className="flex-1 rounded-lg bg-gray-200 px-4 py-2 font-bold text-black transition hover:bg-gray-300"
                              >
                                  Close
                              </button>
                          </div>
                      </div>
                  </div>,
                  portalTarget,
              )
            : null;

    return (
        <>
            {receiptModal}

            <div className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={closeCart} aria-hidden="true" />

            <aside className={`fixed right-0 top-0 z-40 h-full w-full max-w-md bg-[#E9E6E6] shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`} aria-label="Shopping cart">
                <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                    <h2 className="text-2xl font-bold text-black">Cart</h2>
                    <button type="button" onClick={closeCart} className="rounded-full p-2 text-black transition hover:bg-black/10" aria-label="Close cart">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>

                <div className="flex h-[calc(100%-72px)] flex-col">
                    <div className="flex-1 overflow-y-auto px-5 py-4 text-black">
                        {items.length === 0 ? (
                            <p className="text-sm text-black/70">Your cart is empty.</p>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
                                        {item.image ? <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-contain" /> : <div className="h-16 w-16 rounded-lg bg-neutral-200" />}
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-semibold">{item.name}</p>
                                            <p className="text-sm text-black/70">{item.price}</p>
                                            <p className="text-sm text-black/70">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-black/10 px-5 py-4">
                        {checkoutError && <p className="mb-3 text-sm text-red-500">{checkoutError}</p>}
                        {checkoutSuccess && <p className="mb-3 text-sm text-green-500">Payment approved! Clearing cart...</p>}

                        {isCheckoutPending && (
                            <div className="mb-4 rounded bg-blue-100 p-3 text-sm text-blue-800">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-800 border-t-transparent"></div>
                                    <span>Waiting for NFC card tap...</span>
                                </div>
                                {mqttConnected && <p className="mt-2 text-xs">MQTT connected: {mqttConnected ? "✓" : "✗"}</p>}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button onClick={clearCart} disabled={items.length === 0} className="flex-1 rounded-lg bg-red-500 px-4 py-2 font-medium text-black font-semibold transition hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                Clear Cart
                            </button>
                            <button onClick={checkout} disabled={items.length === 0 || isCheckoutPending} className="flex-1 rounded-lg bg-green-500 px-4 py-2 font-medium text-black font-semibold transition hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                                {isCheckoutPending ? "Waiting..." : "Checkout"}
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default CartSidebar;
