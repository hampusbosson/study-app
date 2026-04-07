import React, { ReactNode } from "react"
import HeaderLoggedIn from "../ui/Header/HeaderLoggedIn"

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen flex-col bg-background text-text">
            <HeaderLoggedIn />
            <main className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 pb-6 pt-6 sm:px-6 lg:px-8">
              {children}
            </main>
        </div>
    )
}

export default DashboardLayout;
