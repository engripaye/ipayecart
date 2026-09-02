import {PricingTable} from "@clerk/nextjs";

export default function PricingPage() {
    return (
        <div className='mx-auto max-w-[700px] my-28'>
            {/* Pricing Table */}
            <PricingTable />
        </div>
    )
}