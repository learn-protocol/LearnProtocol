import Link from "next/link";

import "./pagination.scss";

export default function Pagination({
    total,
    currentPage = 1,
    perPage = 25,
}: {
    total: number;
    currentPage?: number;
    perPage?: number;
}) {
    const totalPages = Math.ceil(total / perPage);

    return (
        <div className="pagination">
            {Array(totalPages)
                .fill(0)
                .map((_, i) => {
                    const diff = currentPage - (i + 1);
                    if (totalPages > 6 && i > 0 && i < totalPages - 1) {
                        if (Math.abs(diff) === 2) {
                            return (
                                <span className="dots" key={i}>
                                    ...
                                </span>
                            );
                        }
                        if (diff > 1 || diff < -2) return null;
                    }
                    return (
                        <Link href={`/?p=${i + 1}`} className={currentPage === i + 1 ? "active" : ""} key={i}>
                            {i + 1}
                        </Link>
                    );
                })}
        </div>
    );
}
