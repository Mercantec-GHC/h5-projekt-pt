import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";

export default function Home() {
    return (
        <div className="min-h-screen" style={{ backgroundColor: "#E9E6E6" }}>
            <main>
                <div className="container mx-auto px-4 py-8 text-center flex flex-col my-10 h-auto w-100 rounded-3xl" style={{ backgroundColor: "#5372F0" }}>
                    <h1 className="text-3xl font-bold">Login</h1>

                    <form action="/login" method="post" className="flex flex-col items-center w-full">
                        <div className="relative w-full mt-5">
                            <FontAwesomeIcon icon={faUser} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/80" />
                            <input type="text" placeholder="Username" className="rounded-lg h-10 w-full border border-transparent pl-10 focus:outline-none focus:border-[#8FA7FF]" style={{ backgroundColor: "#4965D4" }} />
                        </div>
                        <div className="relative w-full mt-5 mb-15">
                            <FontAwesomeIcon icon={faLock} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/80" />
                            <input type="password" placeholder="Password" className="rounded-lg h-10 w-full border border-transparent pl-10 focus:outline-none focus:border-[#8FA7FF]" style={{ backgroundColor: "#4965D4" }} />
                        </div>
                        <br />
                        <button type="submit" className="px-8 py-2 mt-5 mb-10 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">
                            Login
                        </button>
                        <br />
                        <p>
                            Don't have an account?{" "}
                            <a href="/register" className="text-black font-bold">
                                Register here
                            </a>
                        </p>
                    </form>
                </div>
            </main>
        </div>
    );
}
