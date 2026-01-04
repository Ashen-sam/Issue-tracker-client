import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "./theme-provider"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    const themes = [
        { value: "light", icon: Sun, label: "Light" },
        { value: "dark", icon: Moon, label: "Dark" },
        { value: "system", icon: Monitor, label: "System" },
    ] as const
    return (
        <div className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
            {themes.map(({ value, icon: Icon, label }) => (
                <button
                    key={value}
                    onClick={() => setTheme(value)}
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${theme === value
                        ? "bg-background text-foreground shadow"
                        : "hover:bg-background/50"
                        }`}
                    type="button"
                >
                    <Icon className="h-4 w-4" />
                    <span className="sr-only">{label}</span>
                </button>
            ))}
        </div>
    )
}