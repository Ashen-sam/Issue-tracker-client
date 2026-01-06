import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Trash2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout, useDeleteUserMutation, useGetCurrentUserQuery, useUpdateUserMutation } from "@/services";
import { IssueDialog, IssueDialogFooter } from "@/common";
import { toast } from "sonner";

export const Settings = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { data: currentUser } = useGetCurrentUserQuery();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
    const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleOpenUpdateDialog = () => {
        if (currentUser?.user) {
            setName(currentUser.user.name);
            setEmail(currentUser.user.email);
            setIsUpdateDialogOpen(true);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            await updateUser({ name, email }).unwrap();
            toast.success("Profile updated successfully");
            setIsUpdateDialogOpen(false);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error?.data?.msg || "Failed to update profile");
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteUser().unwrap();
            toast.success("Account deleted successfully");
            dispatch(logout());
            navigate("/login");
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toast.error(error?.data?.msg || "Failed to delete account");

        }
    };

    return (
        <>
            <div className="max-w-2xl mx-auto p-6">
                <div className="text-2xl font-semibold mb-6 text-gray-800 dark:text-gray-200">
                    Account Settings
                </div>

                <div className="space-y-4">
                    <div className="border  dark:border-zinc-700 rounded-lg p-6 backdrop-blur-xl bg-white/40 dark:bg-zinc-900/40">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                        Profile Information
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Update your account details
                                    </div>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleOpenUpdateDialog}
                                className="text-xs bg-indigo-700/80 text-white
  dark:bg-indigo-500/60
  hover:bg-indigo-600/80 dark:hover:bg-indigo-400/60
  hover:text-white dark:hover:text-white"
                            >
                                Edit Profile
                            </Button>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Name:</span>
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                    {currentUser?.user.name}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                                <span className="font-medium text-gray-800 dark:text-gray-200">
                                    {currentUser?.user.email}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="border border-red-300 dark:border-red-900/50 rounded-lg p-6 backdrop-blur-xl bg-white/40 dark:bg-zinc-900/40">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                                </div>
                                <div>
                                    <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                        Delete Account
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Permanently delete your account and all data
                                    </div>
                                </div>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setIsDeleteDialogOpen(true)}
                                className="text-xs border-red-300 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                            >
                                Delete Account
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <IssueDialog
                open={isUpdateDialogOpen}
                title="Update Profile"
                note="Update your name and email address"
                icon={<User className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                onClose={() => setIsUpdateDialogOpen(false)}
                footer={
                    <IssueDialogFooter
                        onCancel={() => setIsUpdateDialogOpen(false)}
                        onConfirm={handleUpdateProfile}
                        cancelText="Cancel"
                        confirmText="Update Profile"
                        isLoading={isUpdating}
                        formMode="edit"
                    />
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Full Name
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            className="bg-transparent"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="bg-transparent"
                        />
                    </div>
                </div>
            </IssueDialog>

            <IssueDialog
                open={isDeleteDialogOpen}
                title="Delete Account"
                note="This action cannot be undone"
                icon={<AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />}
                onClose={() => setIsDeleteDialogOpen(false)}
                footer={
                    <IssueDialogFooter
                        onCancel={() => setIsDeleteDialogOpen(false)}
                        onConfirm={handleDeleteAccount}
                        cancelText="Cancel"
                        confirmText="Delete Account"
                        isLoading={isDeleting}
                        formMode="delete"
                    />
                }
            >
                <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-red-300 dark:border-red-900/50 bg-red-500/5">
                        <div className="text-sm text-gray-700 dark:text-gray-300">
                            Are you sure you want to delete your account? This will permanently remove:
                        </div>
                        <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
                            <li>Your profile information</li>
                            <li>All your data and content</li>
                            <li>Access to all features</li>
                        </ul>
                    </div>
                    <div className="text-sm font-medium text-red-600 dark:text-red-400">
                        This action cannot be reversed.
                    </div>
                </div>
            </IssueDialog>
        </>
    );
};