import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "../Button";

export default function LoginButton() {
    const { loginWithRedirect } = useAuth0()
    
    return (
        <Button 
            className="w-full bg-blue-500 text-white"
            onClick={() => loginWithRedirect()}
        >
            Login
        </Button>
    )
}