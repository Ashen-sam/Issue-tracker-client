import { ModeToggle } from '@/common';
import { Button } from '@/components/ui/button';
import type { Variants } from 'framer-motion';
import { motion } from 'framer-motion';
import {
    GitBranch,
    Layers,
    Target,
    TrendingUp
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router';

export const Landing = () => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const workflows = [
        {
            icon: <GitBranch className="w-5 h-5" />,
            title: "Initiatives",
            description: "Coordinate strategic product efforts."
        },
        {
            icon: <Layers className="w-5 h-5" />,
            title: "Cross-team projects",
            description: "Collaborate across teams and departments."
        },
        {
            icon: <Target className="w-5 h-5" />,
            title: "Milestones",
            description: "Break projects down into concrete phases."
        },
        {
            icon: <TrendingUp className="w-5 h-5" />,
            title: "Progress insights",
            description: "Track scope, velocity, and progress over time."
        }
    ];

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
            }
        }
    };

    return (
        <div className="min-h-screen transition-colors duration-300 bg-white text-gray-600 dark:bg-[#141414] dark:text-gray-400">
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 20
                    ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200 dark:bg-black/80 dark:border-white/10'
                    : 'bg-transparent'
                    }`}>
                <div className="max-w-300 mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="text-base font-medium text-black dark:text-white">
                            {/* <img src={logo} width={40} height={80} alt="boardy logo" /> */}
                        </div>
                        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                            <a href="#features" className="transition-colors hover:text-black dark:hover:text-white">Features</a>
                            <a href="#method" className="transition-colors hover:text-black dark:hover:text-white">Method</a>
                            <a href="#customers" className="transition-colors hover:text-black dark:hover:text-white">Customers</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <motion.button
                            className=""
                        >
                            <ModeToggle />
                        </motion.button>
                        <Link
                            to={'/login'}
                            className="hidden sm:flex text-sm text-black hover:text-black hover:bg-gray-100 bg-transparent dark:text-white dark:hover:text-white dark:hover:bg-white/10"
                        >
                            Log in
                        </Link>
                    </div>
                </div>
            </motion.nav>

            <section className="relative pt-40 pb-32 px-6 overflow-hidden">
                <div className="max-w-350 mx-auto">
                    <div className="flex *:justify-center items-center text-center ">
                        <motion.div className="z-10">
                            <motion.h1
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight mb-6 leading-[1.1] text-black dark:text-white">
                                <span className='italic relative font-semibold py-2 px-5 rounded-md 
   '>BugTrack
                                    <div
                                        className="absolute inset-0 rounded-xl bg-white opacity-30 blur-lg"
                                        style={{
                                            background: 'radial-gradient(circle, rgba(255,255,255,0.5) 10%, transparent 90%)',
                                        }}
                                    /></span> is a built tool for planning and building products
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="text-lg mb-8 leading-relaxed text-gray-600 dark:text-gray-400">
                                Meet the system for modern software development.<br />
                                Streamline issues, projects, and product roadmaps.
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="flex flex-wrap items-center justify-center gap-4">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="
                                     bg-indigo-700/80 text-white
  dark:bg-indigo-500/60
  hover:bg-indigo-600/80 dark:hover:bg-indigo-400/60
  hover:text-white dark:hover:text-white">
                                        Start building
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                        variant="outline"
                                        className="">
                                        Register
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <section className=" px-6">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="max-w-300 mx-auto">
                    <div className="text-center mb-16">
                        <div className="text-3xl md:text-4xl font-medium mb-4 text-black dark:text-white">
                            Workflows for every team
                        </div>
                        <div className="text-base max-w-150 mx-auto text-gray-600 dark:text-gray-400">
                            From startups to enterprises, ProjectFlow adapts to your workflow and scales with your team's needs.
                        </div>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {workflows.map((workflow, idx) => (
                            <motion.div
                                key={idx}
                                variants={itemVariants}
                                whileHover={{ y: -5 }}
                                className="p-6 rounded-xl bg-gray-50 border border-gray-200 dark:bg-[#141414] dark:border-white/10"
                            >
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-white dark:bg-white/10">
                                    <div className="text-black dark:text-white">
                                        {workflow.icon}
                                    </div>
                                </div>
                                <h3 className="text-base font-medium mb-2 text-black dark:text-white">
                                    {workflow.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {workflow.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            <div className="flex flex-col dark:bg-[#141414]">
                <footer className="border-t border-gray-200 dark:border-white/10">
                    <div className="max-w-300 mx-auto px-6 py-6">
                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Developed and Designed by <span className="font-medium text-black dark:text-white">Ashen Samarasekera</span>
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}