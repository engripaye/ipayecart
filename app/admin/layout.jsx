import AdminLayout from "@/components/admin/AdminLayout";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata = {
    title: "GoCart. - Admin",
    description: "GoCart. - Admin",
};

export default async function RootAdminLayout({ children }) {
    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in?redirect_url=/admin");
    }

    return (

        <AdminLayout>
            {children}
        </AdminLayout>
    );
}