import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "IpayeCart. - Store Dashboard",
    description: "IpayeCart. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
        </>
    );
}
