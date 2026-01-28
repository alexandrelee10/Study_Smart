import React from "react";
import Image from "next/image";

import About1 from "@/public/assets/aboutus/About1.png";
import About2 from "@/public/assets/aboutus/About2.png";
import About3 from "@/public/assets/aboutus/About3.png";

const AboutUsPage = () => {
    return (
        <section className="py-20 space-y-28">
            <div className="max-w-4xl mx-auto px-4 flex flex-col items-center text-center ">
                {/* Top */}
                <div className="mb-12">
                    <h2 className="text-2xl text-zinc-600 font-light">
                        What is StudySmart?
                    </h2>

                    <h1 className="text-6xl font-bold pb-4">
                        Assignment tracker & Study helper
                    </h1>

                    <h2
                        className="text-sm uppercase tracking-wide w-fit mx-auto px-4 py-2
                                    bg-radial from-blue-400 to-blue-500
                                    rounded-full text-white font-semibold
                                    shadow-lg shadow-blue-400/50"
                    >
                        Super charged
                    </h2>
                </div>

                {/* Middle */}
                <div className="justify-center">
                    {/* Top Block */}
                    <div className="flex items-center gap-10">
                        {/* Image */}
                        <Image
                            src={About1}
                            alt="StudySmart dashboard preview"
                            width={140}
                            height={140}
                        />

                        {/* Text */}
                        <p className="text-lg text-zinc-700 leading-relaxed max-w-xl text-left">
                            Study Smart is a <span className="font-semibold">simple, powerful study tracker designed for students</span>
                            who want clarity and consistency. Track your <span className="font-semibold">study time</span>, build better
                            habits, and <span className="font-semibold">stay focused with an immersive fullscreen focus timer—</span>
                            perfect for college, university, or everyday schoolwork.
                        </p>
                    </div>
                    {/* Second Block */}
                    <div className="flex items-center gap-10 py-9">
                        <p className="text-lg text-zinc-700 leading-relaxed max-w-xl text-right">
                            Study Smart <span className="font-semibold">combines study time tracking with a distraction-free focus timer.</span>
                            Use Pomodoro sessions to stay locked in, or start a timer and flow through longer
                            study sessions without interruptions. Everything you need to stay <span className="font-bold">productive</span> lives
                            in one intuitive dashboard.
                        </p>
                        <Image
                            src={About2}
                            alt="Study smart dashboard"
                            width={140}
                            height={140}
                        />
                    </div>
                    {/* Third Block */}
                    <div className="flex items-center gap-10 py-9">
                        <Image 
                        src={About3}
                        alt=""
                        width={140}
                        height={140}
                        />
                        <p className="text-lg text-left text-zinc-700 leading-relaxed max-w-xl">
                            Beyond tracking time, Study Smart <span className="font-semibold">keeps you motivated</span> with built-in accountability tools like <span className="font-semibold">🔥 streaks, 
                            🏆 achievements, and 📊 progress insights</span> so you can see your effort add up, day after day.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutUsPage;
