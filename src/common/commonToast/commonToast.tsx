import { toast } from "sonner";

export const showToast = {
    success: (message: string, description?: string) => {
        toast.success(message, {
            description: description,
            duration: 3000,
        });
    },

    error: (message: string, description?: string) => {
        toast.error(message, {
            description: description,
            duration: 4000,
        });
    },

    info: (message: string, description?: string) => {
        toast.info(message, {
            description: description,
            duration: 3000,
        });
    },

    warning: (message: string, description?: string) => {
        toast.warning(message, {
            description: description,
            duration: 3000,
        });
    },

    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            error: string | ((error: any) => string);
        }
    ) => {
        toast.promise(promise, messages);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    custom: (message: string, options?: any) => {
        toast(message, options);
    },

    loading: (message: string) => {
        return toast.loading(message);
    },

    dismiss: (toastId?: string | number) => {
        toast.dismiss(toastId);
    },
};

