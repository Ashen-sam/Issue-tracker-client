import { type LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface InitialPageProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    actionIcon?: LucideIcon;
    actionLink?: string;
}

export const InitialPage = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    actionLink,
    onAction,
    actionIcon: ActionIcon,
}: InitialPageProps) => {
    return (
        <div className="flex w-full flex-col items-center text-center pt-30 gap-4 max-w-md">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-xl border border-dashed">
                <div
                    className="absolute inset-0 rounded-xl bg-white opacity-30 blur-lg"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,255,255,0.5) 10%, transparent 90%)',
                    }}
                />
                <Icon size={40} className="relative text-zinc-600 dark:text-zinc-200" />
            </div>

            <div className="text-xl text-zinc-600 font-semibold tracking-tight dark:text-zinc-200">
                {title}
            </div>

            <div className="text-sm text-muted-foreground dark:text-zinc-200 px-6 leading-relaxed">
                {description}
            </div>

            {actionLabel && (actionLink || onAction) && (
                actionLink ? (
                    <Button
                        variant="outline"
                        className="
        mt-2 inline-flex items-center gap-2 rounded-md
        border px-4 py-2 text-sm font-medium
        bg-[#1475e1]/80 text-white
        dark:bg-[#1475e1]/70
        hover:bg-[#0f63c7]/80 dark:hover:bg-[#0f63c7]/60
        hover:text-white dark:hover:text-white
        transition
      "
                        asChild
                    >
                        <Link to={actionLink}>
                            {ActionIcon && <ActionIcon size={16} />}
                            {actionLabel}
                        </Link>
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        className="
        mt-2 inline-flex items-center gap-2 rounded-md
        border px-4 py-2 text-sm font-medium
        bg-[#1475e1]/80 text-white
        dark:bg-[#1475e1]/70
        hover:bg-[#0f63c7]/80 dark:hover:bg-[#0f63c7]/60
        hover:text-white dark:hover:text-white
        transition
      "
                        onClick={onAction}
                    >
                        {ActionIcon && <ActionIcon size={16} />}
                        {actionLabel}
                    </Button>
                )
            )}

        </div>
    );
}