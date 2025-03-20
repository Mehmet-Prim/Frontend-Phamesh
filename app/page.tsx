"use client"

import {useEffect, useRef, useState} from "react"
import { Navbar } from "@/app/components/Navbar"
import Link from "next/link"
import { motion } from "framer-motion"
import { Footer } from "@/app/components/Footer"
import Logo from "@/public/Logo.png"
import Image from "next/image";

const partners = [
    "red",
    "green",
    "yellow",
    "red",
    "green",
    "yellow",
    "red",
    "green",
    "yellow",
    "red",
    "green",
    "yellow",
]

export default function Home() {
    const [isHovered, setIsHovered] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const lineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const lineElement = lineRef.current;

        if (!lineElement) return;

        const speedFactor = 1;
        const lineHeight = 770;
        const stopOffset = 0;

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const lineTop = lineElement.getBoundingClientRect().top + window.scrollY;

            const progress = (scrollPosition - lineTop) / (lineHeight - window.innerHeight);

            const newPosition = (1 - progress) * (lineHeight - stopOffset) * speedFactor;

            setScrollY(Math.min(Math.max(newPosition, 0), lineHeight - stopOffset));
        };

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        window.addEventListener("scroll", handleScroll);
                    } else {
                        window.removeEventListener("scroll", handleScroll);
                    }
                });
            },
            { threshold: 0.1 }
        );

        observer.observe(lineElement);

        return () => {
            observer.unobserve(lineElement);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <>
            <div className="dark:bg-[#161616] bg-[#F2EFE7]">
                <Navbar />
                <main className="max-w-7xl w-full px-10 py-6 mx-auto mt-10 mb-10">
                    <div className="flex lg:justify-between justify-center items-center flex-wrap-reverse gap-10">
                        <div className="space-y-6 md:space-y-10 text-center md:text-left">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold dark:text-white">
                                <span className="bg-gradient-to-r from-[#DDB40C] to-[#EA6907] text-transparent bg-clip-text">cooperating</span> <br/>
                                was never <br/>
                                that easy before
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg dark:text-white max-w-md mx-auto md:mx-0">
                                Connect your Socials, find cooperation&#39;s & post videos
                            </p>
                        </div>
                        <div className="relative flex items-center justify-center w-full md:w-auto">
                            <div className="blur-lg absolute w-[300px] sm:w-[400px] md:w-[500px] h-[230px] sm:h-[300px] md:h-[390px] bg-gradient-to-br from-[#DDB40C] to-[#EA6907] border-2 border-white rounded-lg"></div>
                            <div className="blur-xs absolute w-[290px] sm:w-[390px] md:w-[485px] h-[220px] sm:h-[290px] md:h-[375px] bg-white rounded-lg"></div>
                            <div className="w-[280px] sm:w-[380px] md:w-[475px] h-[210px] sm:h-[280px] md:h-[365px] bg-gradient-to-br from-[#DDB40C] to-[#EA6907] rounded-lg relative shadow-xl"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center mt-20 md:mt-36 relative">
                        <Link href="/select-role">
                            <div className="relative">
                                <div
                                    className="absolute inset-0 bg-[#DB134C] blur-lg transition-transform duration-300 ease-in-out"
                                    style={{ animation: isHovered ? 'none' : 'pulse 3s infinite' }}
                                ></div>

                                <button
                                    className="relative bg-[#DB134C] text-base sm:text-lg md:text-xl text-white px-6 py-3 rounded-lg transition-transform duration-300 ease-in-out"
                                    style={{ animation: isHovered ? 'none' : 'pulse 3s infinite' }}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                >
                                    sign up for free →
                                </button>

                                <style>
                                    {`
                                        @keyframes pulse {
                                            0% {
                                                transform: scale(1);
                                            }
                                            50% {
                                                transform: scale(1.1);
                                            }
                                            100% {
                                                transform: scale(1);
                                            }
                                        }
                                    `}
                                </style>

                            </div>
                        </Link>
                    </div>
                    <div className="flex md:justify-between items-center h-full mt-20 md:mt-40 flex-wrap w-full gap-10">
                        <div className="relative flex items-center justify-center w-full md:w-auto order-2 md:order-1">
                            <div className="blur-lg absolute w-[300px] sm:w-[400px] md:w-[500px] h-[350px] sm:h-[450px] md:h-[595px] bg-gradient-to-br from-[#1390B1] to-[#1357B1] border-2 border-white rounded-lg"></div>
                            <div className="blur-xs absolute w-[290px] sm:w-[390px] md:w-[485px] h-[340px] sm:h-[440px] md:h-[580px] bg-white rounded-lg"></div>
                            <div className="w-[280px] sm:w-[380px] md:w-[475px] h-[330px] sm:h-[430px] md:h-[570px] bg-gradient-to-br from-[#1390B1] to-[#1357B1] rounded-lg relative shadow-xl"></div>
                        </div>
                        <div className="space-y-10 md:space-y-20 flex flex-col items-center md:items-end justify-end order-1 md:order-2 w-full md:w-auto">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl text-center md:text-right leading-tight dark:text-white">
                                <span className="bg-gradient-to-r from-[#45A2BD] to-[#1357B1] text-transparent bg-clip-text font-extrabold">
                                    connect with
                                </span>
                                <br />
                                <span className="bg-gradient-to-r from-[#45A2BD] to-[#1357B1] text-transparent bg-clip-text font-extrabold">
                                    companies
                                </span>
                                <br />
                                <span className="text-black font-extrabold dark:text-white">from all over</span>
                                <br />
                                <span className="text-black font-extrabold dark:text-white">the world</span>
                            </h1>
                            <p className="text-sm sm:text-base md:text-lg text-center md:text-right dark:text-white max-w-md">
                                connect your socials find the cooperation&#39;s that suits you the most and you are ready to go. it doesn't matter if you are a content creator or a company
                            </p>
                        </div>
                    </div>
                    <div className="mt-20 md:mt-40 flex items-center justify-center flex-col space-y-10 md:space-y-20">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl text-center font-extrabold dark:text-white">
                            choose from a <span className="bg-gradient-to-r from-[#DB134C] to-[#7B0A2A] text-transparent bg-clip-text">big variety</span> of cooperation offers
                        </h1>
                        <div className="relative flex items-center justify-center w-full">
                            <div className="blur-lg absolute w-full max-w-[1142px] h-[300px] sm:h-[400px] md:h-[602px] bg-gradient-to-br from-[#DB134C] to-[#7B0A2A] border-2 border-white rounded-lg"></div>
                            <div className="blur-xs absolute w-[calc(100%-20px)] max-w-[1132px] h-[290px] sm:h-[390px] md:h-[592px] bg-white rounded-lg"></div>
                            <div className="w-[calc(100%-30px)] max-w-[1122px] h-[280px] sm:h-[380px] md:h-[582px] bg-gradient-to-br from-[#DB134C] to-[#7B0A2A] rounded-lg relative shadow-xl"></div>
                        </div>
                    </div>
                    <div className="mt-20 md:mt-40 w-full overflow-hidden">
                        <h3 className="mb-5 text-2xl sm:text-3xl md:text-4xl text-center dark:text-white font-bold">Our Partners:</h3>
                        <div className="relative w-full">
                            <motion.div
                                className="flex space-x-6 whitespace-nowrap"
                                animate={{
                                    x: ["0%", "-50%"],
                                }}
                                transition={{
                                    ease: "linear",
                                    duration: 10,
                                    repeat: Number.POSITIVE_INFINITY,
                                }}
                            >
                                {[...partners, ...partners].map((color, index) => (
                                    <div key={index} className="min-w-[50px] h-[50px] rounded-lg" style={{ backgroundColor: color }} />
                                ))}
                            </motion.div>
                        </div>
                    </div>
                    <div className="mt-20 md:mt-40 flex flex-col space-y-10 md:space-y-20">
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold dark:text-white">
                                Track your <span className="bg-gradient-to-r from-[#DDB40C] to-[#EA6907] text-transparent bg-clip-text">views</span> and <span className="bg-gradient-to-r from-[#DDB40C] to-[#EA6907] text-transparent bg-clip-text">followers</span>
                            </h1>
                        </div>
                        <div className="flex items-center justify-center md:justify-end">
                            <div className="relative flex items-center justify-center w-full md:w-auto">
                                <div className="blur-lg absolute w-full max-w-[694px] h-[250px] sm:h-[350px] md:h-[420px] bg-gradient-to-br from-[#DDB40C] to-[#EA6907] border-2 border-white rounded-lg"></div>
                                <div className="blur-xs absolute w-[calc(100%-20px)] max-w-[684px] h-[240px] sm:h-[340px] md:h-[410px] bg-white rounded-lg"></div>
                                <div className="w-[calc(100%-30px)] max-w-[674px] h-[230px] sm:h-[330px] md:h-[400px] bg-gradient-to-br from-[#DDB40C] to-[#EA6907] rounded-lg relative shadow-xl"><Image className="flex items-center justify-center" src={Logo} alt={""}/></div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center mt-20 md:mt-40">
                        <div className="text-center">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl dark:text-white font-bold">
                                it <span className="bg-gradient-to-r from-[#1390B1] to-[#1357B1] text-transparent bg-clip-text">doesn't matter</span> whether you are...
                            </h1>
                        </div>

                        <div className="relative flex w-full max-w-7xl mt-10">
                            {/* Mittlere Linie */}
                            <div
                                ref={lineRef} // Referenz für die Intersection Observer API
                                className="absolute left-1/2 transform translate-y-16 -translate-x-1/2 h-[775px] w-3 bg-gradient-to-b from-[#D0C9C1] to-[#313131]"
                            >
                                {/* Rote Linie für die zurückgelegte Strecke */}
                                <div
                                    className="absolute left-1/2 transform -translate-x-1/2 w-3 bg-gradient-to-t from-[#DB134C] to-[#7B0A2A]"
                                    style={{ height: `${scrollY}px`, top: 0 }}
                                ></div>

                                {/* Ball */}
                                <div
                                    className="absolute left-1/2 transform -translate-x-1/2 size-8 bg-[#DB134C] rounded-full transition-all duration-75 ease-in-out"
                                    style={{ transform: `translateY(${scrollY}px)` }}
                                ></div>
                            </div>

                            {/* Linke Seite: Company */}
                            <div className="flex-1 flex flex-col items-center pr-10 space-y-10 text-right">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl dark:text-white">...a company</h2>
                                <div className="relative flex items-center justify-center">
                                    <div className="blur-lg absolute w-[320px] h-[220px] bg-gradient-to-br from-[#1390B1] to-[#1357B1] border-2 border-white rounded-lg"></div>
                                    <div className="blur-xs absolute w-[310px] h-[210px] bg-white rounded-lg"></div>
                                    <div className="w-[300px] h-[200px] bg-gradient-to-br from-[#1390B1] to-[#1357B1] rounded-lg relative shadow-xl"></div>
                                </div>
                                <div className="space-y-20 mt-10">
                                    <div className="relative flex items-center justify-center">
                                        <div className="blur-lg absolute w-[320px] h-[220px] bg-gradient-to-br from-[#DB134C] to-[#7B0A2A] border-2 border-white rounded-lg"></div>
                                        <div className="blur-xs absolute w-[310px] h-[210px] bg-white rounded-lg"></div>
                                        <div className="w-[300px] h-[200px] bg-gradient-to-br from-[#DB134C] to-[#7B0A2A] rounded-lg relative shadow-xl"></div>
                                    </div>
                                    <div className="relative flex items-center justify-center">
                                        <div className="blur-lg absolute w-[320px] h-[220px] bg-gradient-to-br from-[#DDB40C] to-[#EA6907] border-2 border-white rounded-lg"></div>
                                        <div className="blur-xs absolute w-[310px] h-[210px] bg-white rounded-lg"></div>
                                        <div className="w-[300px] h-[200px] bg-gradient-to-br from-[#DDB40C] to-[#EA6907] rounded-lg relative shadow-xl"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Rechte Seite: Content Creator */}
                            <div className="flex-1 flex flex-col items-center pl-10 space-y-10 text-left">
                                <h2 className="text-2xl sm:text-3xl md:text-4xl text-center dark:text-white">...a content creator</h2>
                                <div className="relative flex items-center justify-center">
                                    <div className="blur-lg absolute w-[320px] h-[220px] bg-gradient-to-br from-[#1390B1] to-[#1357B1] border-2 border-white rounded-lg"></div>
                                    <div className="blur-xs absolute w-[310px] h-[210px] bg-white rounded-lg"></div>
                                    <div className="w-[300px] h-[200px] bg-gradient-to-br from-[#1390B1] to-[#1357B1] rounded-lg relative shadow-xl"></div>
                                </div>
                                <div className="space-y-20 mt-10">
                                    <div className="relative flex items-center justify-center">
                                        <div className="blur-lg absolute w-[320px] h-[220px] bg-gradient-to-br from-[#DB134C] to-[#7B0A2A] border-2 border-white rounded-lg"></div>
                                        <div className="blur-xs absolute w-[310px] h-[210px] bg-white rounded-lg"></div>
                                        <div className="w-[300px] h-[200px] bg-gradient-to-br from-[#DB134C] to-[#7B0A2A] rounded-lg relative shadow-xl"></div>
                                    </div>
                                    <div className="relative flex items-center justify-center">
                                        <div className="blur-lg absolute w-[320px] h-[220px] bg-gradient-to-br from-[#DDB40C] to-[#EA6907] border-2 border-white rounded-lg"></div>
                                        <div className="blur-xs absolute w-[310px] h-[210px] bg-white rounded-lg"></div>
                                        <div className="w-[300px] h-[200px] bg-gradient-to-br from-[#DDB40C] to-[#EA6907] rounded-lg relative shadow-xl"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center flex-col space-y-16 justify-center mt-20 relative mb-20">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl text-center dark:text-white font-bold">
                            ...choose of a variety of offers <br/> and explore the<br/>
                            <span className="bg-gradient-to-r from-[#DB134C] to-[#7B0A2A] text-transparent bg-clip-text">world of cooperation&#39;s</span> and <br/>partnerships
                            <br/>with Phamesh
                        </h1>
                        <Link href="/select-role">
                            <div className="relative">
                                <div
                                    className="absolute inset-0 bg-[#DB134C] blur-lg transition-transform duration-300 ease-in-out"
                                    style={{ animation: isHovered ? 'none' : 'pulse 3s infinite' }}
                                ></div>

                                <button
                                    className="relative bg-[#DB134C] text-base sm:text-lg md:text-xl text-white px-6 py-3 rounded-lg transition-transform duration-300 ease-in-out"
                                    style={{ animation: isHovered ? 'none' : 'pulse 3s infinite' }}
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                >
                                    start today!
                                </button>

                                <style>
                                    {`
                                @keyframes pulse {
                                    0% {
                                        transform: scale(1);
                                    }
                                    50% {
                                        transform: scale(1.1);
                                    }
                                    100% {
                                        transform: scale(1);
                                    }
                                }
                                `}
                                </style>
                            </div>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    )
}

