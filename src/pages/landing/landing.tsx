import { Button } from '@/components/ui/button';
import type { Variants } from 'framer-motion';
import { AnimatePresence, motion } from 'framer-motion';
import {
    BarChart3,
    Bell,
    Bug,
    Clock,
    GitBranch,
    Layers,
    Menu,
    Target,
    TrendingUp,
    X,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


export const Landing = () => {
    const [scrollY, setScrollY] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

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

    const features = [
        {
            icon: <Bug className="w-5 h-5" />,
            title: "Smart Bug Tracking",
            description: "Automatically categorize and prioritize bugs with AI-powered tagging and intelligent routing to the right team members."
        },
        {
            icon: <Zap className="w-5 h-5" />,
            title: "Real-time Updates",
            description: "See changes instantly across your team with optimistic UI updates. No refresh needed, just seamless collaboration."
        },
        {
            icon: <BarChart3 className="w-5 h-5" />,
            title: "Advanced Analytics",
            description: "Gain insights into bug trends, resolution times, and team performance with detailed dashboards and reports."
        },
        {
            icon: <Clock className="w-5 h-5" />,
            title: "Time Tracking",
            description: "Monitor how long issues take to resolve and optimize your workflow with built-in time tracking."
        },
    ];

    const stats = [
        { value: "10K+", label: "Issues Tracked Daily" },
        { value: "500+", label: "Teams Using BugTrack" },
        { value: "99.9%", label: "Uptime Guarantee" },
        { value: "< 2min", label: "Average Response Time" }
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

    const sidebarVariants: Variants = {
        closed: {
            y: '-100%',
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        },
        open: {
            y: 0,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 40
            }
        }
    };

    const overlayVariants: Variants = {
        closed: {
            opacity: 0,
            transition: {
                duration: 0.2
            }
        },
        open: {
            opacity: 1,
            transition: {
                duration: 0.2
            }
        }
    };

    const menuItemVariants: Variants = {
        closed: {
            opacity: 0,
            y: -20
        },
        open: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: 0.1 + i * 0.05,
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1]
            }
        })
    };

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        setTimeout(() => {
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 300);
    };

    const handleDesktopLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const element = document.querySelector(href);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleButtonClick = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen transition-colors duration-300">
            <div className="min-h-screen bg-white text-gray-600 dark:bg-[#141414] dark:text-gray-400">
                <motion.nav
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 20
                        ? 'bg-white/80 backdrop-blur-xl border-b border-gray-200 dark:bg-black/80 dark:border-white/10'
                        : 'bg-transparent'
                        }`}>
                    <div className="relative max-w-[1100px] mx-auto px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-black  p-2 rounded-sm dark:text-white">
                            <Bug className="w-10 h-10 relative text-zinc-600 dark:text-zinc-200" />
                        </div>
                        <div className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-8 text-sm text-gray-600 dark:text-gray-400">
                            <a
                                href="#features"
                                onClick={(e) => handleDesktopLinkClick(e, '#features')}
                                className="transition-colors hover:text-black dark:hover:text-white cursor-pointer"
                            >
                                Features
                            </a>
                            <a
                                href="#method"
                                onClick={(e) => handleDesktopLinkClick(e, '#method')}
                                className="transition-colors hover:text-black dark:hover:text-white cursor-pointer"
                            >
                                Method
                            </a>
                            <a
                                href="#customers"
                                onClick={(e) => handleDesktopLinkClick(e, '#customers')}
                                className="transition-colors hover:text-black dark:hover:text-white cursor-pointer"
                            >
                                Customers
                            </a>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="hidden sm:flex text-sm  hover:bg-gray-100  dark:hover:bg-white/10 px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 transition-colors">
                                <Link to={'login'}>
                                    Log in

                                </Link>
                            </button>
                            <Button size="sm" variant="default">
                                <Link to={'register'}>
                                    Sign up

                                </Link>
                            </Button>

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-white/10"
                            >
                                <Menu className="w-5 h-5 text-black dark:text-white" />
                            </motion.button>
                        </div>
                    </div>

                </motion.nav>

                <AnimatePresence mode="wait">
                    {isMobileMenuOpen && (
                        <>
                            <motion.div
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={overlayVariants}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-60 md:hidden"
                            />
                            <motion.div
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={sidebarVariants}
                                className="fixed top-0 left-0 right-0 bg-white dark:bg-[#141414] border-b border-gray-200 dark:border-white/10 z-[70] md:hidden shadow-2xl"
                            >
                                <div className="max-h-screen overflow-y-auto">
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-8">
                                            <motion.div
                                                custom={0}
                                                variants={menuItemVariants}
                                                className="text-base font-medium text-black dark:text-white"
                                            >
                                                Menu
                                            </motion.div>
                                            <motion.button
                                                custom={0}
                                                variants={menuItemVariants}
                                                whileHover={{ scale: 1.05, rotate: 90 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="p-2 rounded-lg bg-gray-100 dark:bg-white/10"
                                            >
                                                <X className="w-5 h-5 text-black dark:text-white" />
                                            </motion.button>
                                        </div>

                                        <div className="flex flex-col gap-6">
                                            <div className="flex flex-col gap-1">
                                                <motion.a
                                                    custom={1}
                                                    variants={menuItemVariants}
                                                    href="#features"
                                                    onClick={(e) => handleLinkClick(e, '#features')}
                                                    className="text-base text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5"
                                                >
                                                    Features
                                                </motion.a>
                                                <motion.a
                                                    custom={2}
                                                    variants={menuItemVariants}
                                                    href="#method"
                                                    onClick={(e) => handleLinkClick(e, '#method')}
                                                    className="text-base text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5"
                                                >
                                                    Method
                                                </motion.a>
                                                <motion.a
                                                    custom={3}
                                                    variants={menuItemVariants}
                                                    href="#customers"
                                                    onClick={(e) => handleLinkClick(e, '#customers')}
                                                    className="text-base text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors py-3 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5"
                                                >
                                                    Customers
                                                </motion.a>
                                            </div>

                                            <motion.div
                                                custom={4}
                                                variants={menuItemVariants}
                                                className="border-t border-gray-200 dark:border-white/10 pt-6 flex flex-col gap-3"
                                            >
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-center"
                                                    onClick={handleButtonClick}
                                                >
                                                    Log in
                                                </Button>
                                                <Button
                                                    className="w-full justify-center bg-indigo-700/80 text-white dark:bg-indigo-500/60 hover:bg-indigo-600/80 dark:hover:bg-indigo-400/60 hover:text-white dark:hover:text-white"
                                                    onClick={handleButtonClick}
                                                >
                                                    Start building
                                                </Button>
                                            </motion.div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
                <section className="relative pt-40 pb-32 px-6 overflow-hidden">
                    <div className="max-w-5xl mx-auto text-center">

                        <motion.h1
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight leading-[1.08] text-black dark:text-white"
                        >
                            <span className="relative font-bold italic text-[80px]">
                                BugTrack
                                <span
                                    className="absolute inset-0 blur-xl opacity-40"
                                    style={{
                                        background:
                                            "radial-gradient(circle at center, rgba(255,255,255,0.6), transparent 70%)",
                                    }}
                                />
                            </span>{" "}
                            is a purpose-built tool for tracking project issues
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
                        >
                            Meet the system for modern software development.
                            <br />
                            Streamline issues, projects, and product roadmaps.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-10 flex items-center justify-center gap-4"
                        >
                            <Button className="h-11 text-white border px-4 py-2 text-sm font-medium dark:bg-indigo-500/60 bg-indigo-700/80 hover:opacity-90">
                                <Link to={'login'}>
                                    Start building
                                </Link>
                            </Button>

                            <Button
                                variant="ghost"
                                className="px-6 h-11 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                            >
                                <Link to={'register'}>
                                    Register

                                </Link>
                            </Button>
                        </motion.div>
                    </div>
                </section>


                <section className="px-6 pb-20">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        className="max-w-300 mx-auto">
                        <motion.div
                            variants={containerVariants}
                            className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    className="text-center">
                                    <div className="text-3xl md:text-4xl font-semibold mb-2 text-black dark:text-white">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {stat.label}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </section>

                <section id="features" className="px-6 pb-32">
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
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {workflow.description}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </section>

                <section id="method" className="px-6 pb-32">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        className="max-w-300 mx-auto">
                        <div className="text-center mb-16">
                            <div className="text-3xl md:text-4xl font-medium mb-4 text-black dark:text-white">
                                Powerful features for modern teams
                            </div>
                            <div className="text-base max-w-150 mx-auto text-gray-600 dark:text-gray-400">
                                Everything you need to track, manage, and resolve issues faster than ever before.
                            </div>
                        </div>

                        <motion.div
                            variants={containerVariants}
                            className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                            {features.map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    className="p-6 rounded-xl bg-gray-50 border border-gray-200 dark:bg-[#141414] dark:border-white/10"
                                >
                                    <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 bg-white dark:bg-white/10">
                                        <div className="text-black dark:text-white">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-base font-medium mb-2 text-black dark:text-white">
                                        {feature.title}
                                    </h3>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {feature.description}
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </section>

                <section id="customers" className="px-6 pb-32">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                        className="max-w-300 mx-auto">
                        <div className="p-12 rounded-2xl bg-gray-50 border border-gray-200 dark:bg-[#141414] dark:border-white/10 text-center">
                            <Bell className="w-12 h-12 mx-auto mb-6 text-black dark:text-white" />
                            <h2 className="text-3xl md:text-4xl font-medium mb-4 text-black dark:text-white">
                                Ready to streamline your workflow?
                            </h2>
                            <div className="text-base mb-8 text-gray-600 dark:text-gray-400 max-w-150 mx-auto">
                                Join thousands of teams already using BugTrack to ship better software, faster.
                            </div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button className="bg-indigo-700/80 text-white dark:bg-indigo-500/60 hover:bg-indigo-600/80 dark:hover:bg-indigo-400/60 hover:text-white dark:hover:text-white">
                                    <Link to={'login'}>
                                        Get started for free

                                    </Link>
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                <div className="flex flex-col dark:bg-[#141414]">
                    <footer className="border-t border-gray-200 dark:border-white/10">
                        <div className="max-w-300 mx-auto px-6 py-6">
                            <div className="text-center">
                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    Developed and Designed by :  <span className="font-medium text-black dark:text-white">Ashen Samarasekera</span>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}