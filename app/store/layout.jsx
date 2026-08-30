import StoreLayout from "@/components/store/StoreLayout";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const metadata = {
    title: "IpayeCart. - Store Dashboard",
    description: "IpayeCart. - Store Dashboard",
};

export default async function RootStoreLayout({ children }) {

    const { userId } = await auth();

    if (!userId) {
        redirect("/sign-in?redirect_url=/store");
    }

    return (
        <StoreLayout>
            {children}
        </StoreLayout>
    );
}
