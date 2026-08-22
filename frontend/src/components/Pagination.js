

import "./Pagination.css";

export default function Pagination({
    page,
    totalPages,
    onPageChange,
}) {
    const safeTotalPages = Math.max(
        Number(totalPages) || 1,
        1
    );

    const safePage = Math.min(
        Math.max(Number(page) || 1, 1),
        safeTotalPages
    );

    const handlePrevious = () => {
        if (safePage > 1) {
            onPageChange(safePage - 1);
        }
    };

    const handleNext = () => {
        if (safePage < safeTotalPages) {
            onPageChange(safePage + 1);
        }
    };

    return (
        <div className="pagination-container">

            {/* LEFT */}
            <div className="pagination-left">

                <button
                    className="pagination-prev"
                    disabled={safePage === 1}
                    onClick={handlePrevious}
                >
                    ← Previous
                </button>

            </div>

            {/* CENTER */}
            <div className="pagination-pages">

                {Array.from(
                    { length: safeTotalPages },
                    (_, index) => index + 1
                ).map((pageNumber) => (

                    <button
                        key={pageNumber}
                        className={
                            safePage === pageNumber
                                ? "pagination-page active"
                                : "pagination-page"
                        }
                        onClick={() =>
                            onPageChange(pageNumber)
                        }
                    >
                        {pageNumber}
                    </button>

                ))}

            </div>

            {/* RIGHT */}
            <div className="pagination-right">

                <button
                    className="pagination-next"
                    disabled={
                        safePage === safeTotalPages
                    }
                    onClick={handleNext}
                >
                    Next →
                </button>

            </div>

        </div>
    );
}
