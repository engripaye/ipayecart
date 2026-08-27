'use client'
import { useEffect, useState } from "react"
import Loading from "../Loading"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import AdminNavbar from "./AdminNavbar"
import AdminSidebar from "./AdminSidebar"
import {useAuth, useUser} from "@clerk/nextjs";
import axios from "axios";

const AdminLayout = ({ children }) => {

    const {user} = useUser()
    const { getToken } = useAuth()
    const [isAdmin, setIsAdmin] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchIsAdmin = async () => {
        try{
            const token = await getToken()
            const {data} = await axios.get('/api/admin/is-admin', {headers: {Authorization: `Bearer ${token}`}})
            setIsAdmin(data.isAdmin)
        }catch (error){
            console.log(error)

        }finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if(user){
            fetchIsAdmin()
        }
        fetchIsAdmin()
    }, [user])

    return loading ? (
        <Loading />
    ) : isAdmin ? (
        <div className="flex flex-col h-screen">
            <AdminNavbar />

            <div className="flex flex-1 items-start h-full overflow-y-scroll no-scrollbar">
                <AdminSidebar />

                <div className="flex-1 h-full p-5 lg:p-12 overflow-y-scroll">
                    <div className="w-full max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-2xl sm:text-4xl font-semibold text-slate-400">You are not authorized to access this page</h1>
            <Link href="/" className="bg-slate-700 text-white flex items-center gap-2 mt-8 p-2 px-6 max-sm:text-sm rounded-full">
                Go to home <ArrowRightIcon size={18} />
            </Link>
        </div>
    )
}

export default AdminLayout