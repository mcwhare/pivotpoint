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

// ── Multi-Modal & Form Submission Logic ──────────────────────
document.addEventListener("DOMContentLoaded", () => {
    // 1. Setup Elements
    const backdrop = document.getElementById("modal-backdrop");
    const resumeModal = document.getElementById("resume-modal");
    const mentorshipModal = document.getElementById("mentorship-modal");
    const closeButtons = document.querySelectorAll(".close-modal");

    // Helper: Open Modal
    const openModal = (modal) => {
        if (!modal || !backdrop) return;
        backdrop.classList.remove("hidden");
        modal.classList.remove("hidden");
        // Small delay to allow display block to apply before animating opacity
        setTimeout(() => {
            backdrop.classList.remove("opacity-0");
            const content = modal.querySelector(".modal-content");
            if (content) content.classList.remove("opacity-0", "scale-95");
        }, 10);
    };

    // Helper: Close All Modals
    const closeModals = () => {
        if (!backdrop) return;
        backdrop.classList.add("opacity-0");
        document.querySelectorAll(".modal-content").forEach(content => {
            content.classList.add("opacity-0", "scale-95");
        });
        // Wait for transition to finish before hiding
        setTimeout(() => {
            backdrop.classList.add("hidden");
            if (resumeModal) resumeModal.classList.add("hidden");
            if (mentorshipModal) mentorshipModal.classList.add("hidden");
        }, 300);
    };

    // Bind Open Buttons
    const btnOpenResume = document.getElementById("open-resume-modal");
    const btnOpenMentorship = document.getElementById("open-mentorship-modal");

    if (btnOpenResume) {
        btnOpenResume.addEventListener("click", (e) => {
            e.preventDefault();
            openModal(resumeModal);
        });
    }

    if (btnOpenMentorship) {
        btnOpenMentorship.addEventListener("click", (e) => {
            e.preventDefault();
            openModal(mentorshipModal);
        });
    }

    // Bind Close Actions
    closeButtons.forEach(btn => btn.addEventListener("click", closeModals));
    if (backdrop) backdrop.addEventListener("click", closeModals);


    // ── Helper: Loading Spinner SVG ──
    const getSpinner = (text) => `
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        ${text}
    `;

    // ── 2. Resume Form Submission (Goes to Stripe) ──
    const resumeForm = document.getElementById("resume-form");
    if (resumeForm) {
        resumeForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const resumeFile = document.getElementById("res-resumeFile")?.files[0];
            const coverLetterFile = document.getElementById("res-coverLetterFile")?.files[0];

            if (!resumeFile && !coverLetterFile) {
                alert("Please upload at least one document (Resume or Cover Letter).");
                return;
            }

            const submitBtn = document.getElementById("res-submit-btn");
            const originalText = submitBtn.innerHTML;

            // Visual loading state
            submitBtn.innerHTML = getSpinner("Preparing Checkout...");
            submitBtn.disabled = true;

            const formData = new FormData();
            formData.append('fname', document.getElementById('res-fname').value);
            formData.append('lname', document.getElementById('res-lname').value);
            formData.append('email', document.getElementById('res-email').value);
            formData.append('phone', document.getElementById('res-phone').value || 'none');
            formData.append('role', document.getElementById('res-role').value);
            formData.append('docType', 'Document Review');

            if (resumeFile) formData.append('resumeFile', resumeFile);
            if (coverLetterFile) formData.append('coverLetterFile', coverLetterFile);

            try {
                const response = await fetch("https://auth.pivotpointeducation.com.au/api/checkout", {
                    method: "POST",
                    body: formData
                });

                const data = await response.json();

                if (response.ok && data.url) {
                    window.location.href = data.url; // Redirect to Stripe
                } else {
                    throw new Error(data.error || "Failed to create checkout session");
                }
            } catch (err) {
                console.error(err);
                alert("Something went wrong preparing your checkout. Please try again.");
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }

    // ── 3. Mentorship Form Submission (Goes to Email/Discord Flow) ──
    const mentorshipForm = document.getElementById("mentorship-form");
    if (mentorshipForm) {
        mentorshipForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const submitBtn = document.getElementById("men-submit-btn");
            const originalText = submitBtn.innerHTML;

            // Visual loading state
            submitBtn.innerHTML = getSpinner("Sending Application...");
            submitBtn.disabled = true;

            const formData = new FormData();
            formData.append('fname', document.getElementById('men-fname').value);
            formData.append('lname', document.getElementById('men-lname').value);
            formData.append('email', document.getElementById('men-email').value);
            formData.append('phone', document.getElementById('men-phone').value || 'none');
            formData.append('comments', document.getElementById('men-comments').value);
            formData.append('role', 'Mentorship Student');

            const resumeFile = document.getElementById('men-resumeFile')?.files[0];
            if (resumeFile) formData.append('resumeFile', resumeFile);

            try {
                const response = await fetch("https://auth.pivotpointeducation.com.au/api/submit-application", {
                    method: "POST",
                    body: formData
                });

                if (response.ok) {
                    alert("Success! Check your email for your exclusive Discord link.");
                    mentorshipForm.reset();
                    closeModals();
                } else {
                    const data = await response.json();
                    throw new Error(data.error || "Failed to submit application");
                }
            } catch (err) {
                console.error(err);
                alert("Connection error. Ensure the server is running.");
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
});
