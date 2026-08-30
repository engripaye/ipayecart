import StoreLayout from "@/components/store/StoreLayout";
import {SignedIn, SignedOut, SignIn} from "@clerk/nextjs"
export const metadata = {
    title: "IpayeCart. - Store Dashboard",
    description: "IpayeCart. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <SignedIn>
                <StoreLayout>
                    {children}
                </StoreLayout>
            </SignedIn>
            <SignedOut>
                <div className="min-h-screen flex items-center justify-center">
                    <SignIn fallbackRedirectUrl="/store"/>
                </div>
            </SignedOut>

        </>
    );
}
