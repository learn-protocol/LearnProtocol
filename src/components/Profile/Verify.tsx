"use client";

import { toast } from "sonner";
import { useState } from "react";

import Loading from "../Loading";
import { Button } from "../ui/button";
import { useUserStore } from "@/lib/states";
import { Verify } from "@/actions/auth/Verify";
import { GetVerificationWallet } from "@/actions/auth/GetVerificationWallet";
import { CopyIcon } from "lucide-react";

export default function VerifyComponent({ done = false }: { done?: boolean }) {
    const { user, setUser } = useUserStore();

    const [wallet, setWallet] = useState<string | null>(null);
    const [stepTwoError, setStepTwoError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    function handleVerification() {
        if (!user) return;
        stepOne();
    }

    function copyWalletAddress() {
        if (!wallet) return;
        navigator.clipboard.writeText(wallet).then(() => {
            toast.success("Wallet address copied to clipboard!");
        });
    }

    // Get wallet address
    const stepOne = async () => {
        setLoading(true);

        try {
            const depositAddress = (await GetVerificationWallet())?.wallet;
            if (!depositAddress) {
                throw new Error("Wallet address not found");
            }

            setWallet(depositAddress);
            setStep(2);
        } catch (error) {
            toast.error("Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    // Check if 1 EDU coin was sent to the wallet address
    const stepTwo = async () => {
        setLoading(true);

        try {
            const isVerified = (await Verify())?.verified;

            if (isVerified) {
                setUser({ ...user!, verified: true });
                toast.success("Account verified successfully!");
                setStep(3);
            } else {
                toast.error("Please send 1 EDU coin to the wallet address.");
                setStepTwoError("Please send 1 EDU coin to the wallet address.");
            }
        } catch (error) {
            toast.error(
                "Wallet cannot be verified. Please be sure to send 1 EDU coin to the wallet address.",
            );
            setStepTwoError(
                "Wallet cannot be verified. Please be sure to send 1 EDU coin to the wallet address.",
            );
        } finally {
            setLoading(false);
        }
    };

    if (step === 3 || done) return <Button disabled>Account is Verified</Button>;
    if (step === 1 && loading) return <Loading size={24} />;
    if (step === 1) return <Button onClick={handleVerification}>Verify Account</Button>;
    if (step === 2)
        return (
            <div className="verification-container">
                <p>Deposit 1 EDU coin to this wallet address (ERC-20): </p>
                <div className="wallet" onClick={copyWalletAddress}>
                    <CopyIcon className="copy-icon" size={16} />
                    {wallet}
                </div>
                <Button variant="outline" onClick={stepTwo} disabled={loading}>
                    {loading ? <Loading size={24} /> : "I've sent 1 EDU coin"}
                </Button>
                {stepTwoError && <p className="!text-red-600 text-sm">{stepTwoError}</p>}
            </div>
        );
    return null;
}
