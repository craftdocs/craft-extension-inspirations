import React from "react";
import "../style.css";
import { PageMode } from "./page";

interface HeaderProps {
    backSelected: () => void;
    mode: PageMode;
}

export const Header: React.FC<HeaderProps> = ({ mode, backSelected }) => {
    const [pageTitle, setPageTitle] = React.useState("Craft PowerTools");

    React.useEffect(() => {
        switch (mode) {
            case "main":
                setPageTitle("Craft PowerTools");
                break;
            case "findAndReplace":
                setPageTitle("Find & Replace");
                break;
            case "advancedSelection":
                setPageTitle("Select Blocks");
                break;
            case "advancedActions":
                setPageTitle("Apply Action");
                break;
        }
    }, [mode]);

    return <header id="header" className="bg-systemBackground text-center border-b border-interfaceBorder text-sm font-medium z-50 dark:bg-systemBackground-dark dark:border-interfaceBorder-dark">
        <div className="h-full flex flex-row">
            <div id="navBar_backButton" onClick={backSelected} style={mode === "main" ? {visibility: "hidden"} : {}}
                 className="flex flex-none w-12 justify-center items-center text-secondaryText dark:text-secondaryText-dark cursor-pointer hover:text-gray-700 dark:hover:text-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
            </div>
            <div id="navBar_title" className="flex flex-grow justify-center items-center truncate text-text dark:text-text-dark">{pageTitle}
            </div>
            <div className="flex-none w-12"></div>
        </div>
    </header>;
}
