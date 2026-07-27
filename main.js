// ── Mobile nav toggle ───────────────────────────────────────
const navToggle = document.getElementById("nav-toggle");
const mobileMenu = document.getElementById("mobile-menu");

navToggle.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("open");
    mobileMenu.classList.toggle("open");
    navToggle.classList.toggle("open");
});

// Close mobile menu when a link is tapped
document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        navToggle.classList.remove("open");
    });
});

// ── FAQ Accordion ──────────────────────────────────────────
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
    item.querySelector(".faq-q").addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        faqItems.forEach((i) => i.classList.remove("open"));
        if (!isOpen) item.classList.add("open");
    });
});

// ── Scroll Reveal ───────────────────────────────────────────
const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.1 }
);

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ── Nav scroll shadow ───────────────────────────────────────
const nav = document.querySelector("nav");

window.addEventListener(
    "scroll",
    () => {
        nav.classList.toggle("scrolled", window.scrollY > 10);
    },
    { passive: true }
);

// ── Modal Form ───────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("review-modal");
    const backdrop = document.getElementById("modal-backdrop");
    const content = document.getElementById("modal-content");
    const openBtn = document.getElementById("open-review-modal");
    const closeBtn = document.getElementById("close-modal");
    const form = document.getElementById("review-form");
    const submitBtn = document.getElementById("submit-form-btn");

    // ── Modal Open/Close Logic ──
    const openModal = () => {
        modal.classList.remove("hidden");
        // Small delay to allow display block to register before animating opacity
        setTimeout(() => {
            backdrop.classList.remove("opacity-0");
            content.classList.remove("opacity-0", "scale-95");
        }, 10);
    };

    const closeModal = () => {
        backdrop.classList.add("opacity-0");
        content.classList.add("opacity-0", "scale-95");
        // Wait for transition to finish before hiding
        setTimeout(() => {
            modal.classList.add("hidden");
        }, 300);
    };

    if (openBtn)
        openBtn.addEventListener("click", (e) => {
            e.preventDefault();
            openModal();
        });

    closeBtn.addEventListener("click", closeModal);
    backdrop.addEventListener("click", closeModal);

    // ── Form Submission to Node.js / Stripe ──
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const resume = document.getElementById("resumeFile").files.length;
        const coverLetter = document.getElementById("coverLetterFile").files.length;

        if (resume === 0 && coverLetter === 0) {
            alert("Please upload at least one document (Résumé or Cover Letter).");
            return; // Stop the submission
        }

        // Visual loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
        `;
        submitBtn.disabled = true;

        // Package data including the file
        const formData = new FormData(form);

        try {
            // Replace with your actual Node server endpoint
            const response = await fetch("https://auth.pivotpointeducation.com.au/api/checkout", {
                method: "POST",
                body: formData // Notice: No Content-Type header when sending files
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url; // Redirect to Stripe
            } else {
                throw new Error(data.error || "Failed to create checkout session");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong preparing your checkout. Please try again.");
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
});
