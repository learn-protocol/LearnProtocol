import Link from "next/link";

import "../../not-found.scss";

export default function Search404() {
    return (
        <div className="custom-not-found">
            <p className="idk">¯\_(ツ)_/¯</p>
            <span>
                No results for this question. Maybe you can <Link href="/ask">ask</Link>?
            </span>
        </div>
    );
}
