import {Loader2} from "lucide-react";
import {cn} from "@/lib/utils";

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg'
}

export function LoadingIcon({ className, size = 'md', ...props }: SpinnerProps) {
    return (
        <div role="status" {...props}>
            <Loader2
                className={cn(
                    "animate-spin",
                    {
                        'h-4 w-4': size === 'sm',
                        'h-6 w-6': size === 'md',
                        'h-8 w-8': size === 'lg',
                    },
                    className
                )}
            />
            <span className="sr-only">Loading...</span>
        </div>
    )
}
