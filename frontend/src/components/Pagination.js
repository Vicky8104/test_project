import { useEffect, useState } from "react";
import "./Pagination.css";

export default function Pagination({
    page,
    totalPages,
    totalUsers,
    limit,
    onPageChange,
}) {
    // =====================================================
    // SAFE VALUES
    // =====================================================

    const safeTotalPages = Math.max(
        Number(totalPages) || 1,
        1
    );

    const safePage = Math.min(
        Math.max(Number(page) || 1, 1),
        safeTotalPages
    );

    const safeTotalUsers = Math.max(
        Number(totalUsers) || 0,
        0
    );

    const safeLimit = Math.max(
        Number(limit) || 20,
        1
    );

    // =====================================================
    // PAGE INPUT
    // =====================================================

    const [pageInput, setPageInput] = useState(
        String(safePage).padStart(2, "0")
    );

    // =====================================================
    // UPDATE INPUT WHEN PAGE CHANGES
    // =====================================================

    useEffect(() => {
        setPageInput(
            String(safePage).padStart(2, "0")
        );
    }, [safePage]);

    // =====================================================
    // FORMATTED VALUES
    // =====================================================

    const formattedPage = String(
        safePage
    ).padStart(2, "0");

    const formattedTotalPages = String(
        safeTotalPages
    ).padStart(2, "0");

    // =====================================================
    // PREVIOUS
    // =====================================================

    const handlePrevious = () => {
        if (safePage > 1) {
            onPageChange(safePage - 1);
        }
    };

    // =====================================================
    // NEXT
    // =====================================================

    const handleNext = () => {
        if (safePage < safeTotalPages) {
            onPageChange(safePage + 1);
        }
    };

    // =====================================================
    // PAGE INPUT CHANGE
    // =====================================================

    const handlePageInputChange = (e) => {
        const value = e.target.value;

        // Only numbers
        if (!/^\d*$/.test(value)) {
            return;
        }

        setPageInput(value);
    };

    // =====================================================
    // GO TO PAGE
    // =====================================================

    const goToPage = () => {
        const requestedPage = Number(pageInput);

        // Empty / invalid
        if (!requestedPage) {
            setPageInput(formattedPage);
            return;
        }

        // Page range validation
        if (
            requestedPage < 1 ||
            requestedPage > safeTotalPages
        ) {
            setPageInput(formattedPage);
            return;
        }

        // Same page
        if (requestedPage === safePage) {
            setPageInput(
                String(requestedPage).padStart(2, "0")
            );
            return;
        }

        // Direct page change
        onPageChange(requestedPage);

        // Example: 5 -> 05
        setPageInput(
            String(requestedPage).padStart(2, "0")
        );
    };

    // =====================================================
    // ENTER / ESCAPE
    // =====================================================

    const handlePageInputKeyDown = (e) => {
        if (e.key === "Enter") {
            goToPage();
            e.target.blur();
        }

        if (e.key === "Escape") {
            setPageInput(formattedPage);
            e.target.blur();
        }
    };

    // =====================================================
    // INPUT BLUR
    // =====================================================

    const handlePageInputBlur = () => {
        goToPage();
    };

    // =====================================================
    // INPUT FOCUS
    // =====================================================

    const handlePageInputFocus = (e) => {
        e.target.select();
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="pagination-container">

            {/* =================================================
                LEFT
            ================================================= */}

            <div className="pagination-left">

                <button
                    type="button"
                    className="pagination-prev"
                    disabled={safePage === 1}
                    onClick={handlePrevious}
                >
                    ← Previous
                </button>

            </div>

            {/* =================================================
                CENTER
            ================================================= */}

            <div className="pagination-pages">

                {/* PAGE COUNTER */}

                <div className="pagination-counter">

                    {/* CURRENT PAGE INPUT */}

                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={3}
                        value={pageInput}
                        onChange={
                            handlePageInputChange
                        }
                        onFocus={
                            handlePageInputFocus
                        }
                        onKeyDown={
                            handlePageInputKeyDown
                        }
                        onBlur={
                            handlePageInputBlur
                        }
                        className="pagination-page-input"
                        aria-label="Enter page number"
                    />

                    <span className="page-separator">
                        /
                    </span>

                    {/* TOTAL PAGES */}

                    <span className="total-pages">
                        {formattedTotalPages}
                    </span>

                </div>

                {/* TOTAL USERS */}

                <div className="total-users">

                    Total Users:{" "}

                    <strong>
                        {safeTotalUsers}
                    </strong>

                </div>

            </div>

            {/* =================================================
                RIGHT
            ================================================= */}

            <div className="pagination-right">

                <button
                    type="button"
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
