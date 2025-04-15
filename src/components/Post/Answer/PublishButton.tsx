"use client";

import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";

export default function PublishAnswerButton({ pending }: { pending: boolean }) {
    return (
        <Button variant="default" type="submit" disabled={pending} className="publish">
            {pending ? <Loading size={24} white /> : "Publish Answer"}
        </Button>
    );
}
