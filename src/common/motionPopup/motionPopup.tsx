import { motion } from "framer-motion"
import { Moon } from "lucide-react"
export const MotionPopup = ({
    handleDismiss
}: { handleDismiss: () => void }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 25
            }}
            className="fixed bottom-6 left-6 z-50"
        >
            <div className="bg-[#1a1a1a] border rounded-xl shadow-2xl p-5 max-w-sm backdrop-blur-xl">
                <div className="flex items-start gap-4">
                    <motion.div
                        initial={{ rotate: -180, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        transition={{
                            delay: 0.2,
                            type: "spring",
                            stiffness: 200
                        }}
                        className="relative border border-dashed border-zinc-600 p-3 rounded-lg"
                    >
                        <Moon className="  relative  text-zinc-200" />
                        <div
                            className="absolute inset-0 rounded-xl bg-white opacity-30 blur-lg"
                            style={{
                                background: 'radial-gradient(circle, rgba(255,255,255,0.5) 90%, transparent 90%)',
                            }}
                        />

                    </motion.div>
                    <div className="flex-1">
                        <motion.h3
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-white font-semibold text-base mb-1"
                        >
                            Hey Lad 👋
                        </motion.h3>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-slate-300 text-sm leading-relaxed"
                        >
                            Try switching to dark mode for a better experience with reduced eye strain!
                        </motion.p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleDismiss}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    )
}