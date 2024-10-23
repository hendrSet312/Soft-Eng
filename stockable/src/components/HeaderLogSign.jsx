import React from "react";
import logo from "../assets/Stockable_logo.png";

const HeaderLogSign = () => {
    return (
        <header className="bg-white text-white p-4 border-2 w-screen">
            <div className="container mx-auto flex justify-between items-center pt-1">
                <img src={logo} alt="logo" className="h-8" />
            </div>
        </header>
    );
}

export default HeaderLogSign;