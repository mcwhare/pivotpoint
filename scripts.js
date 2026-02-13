document.querySelectorAll(".faq-item details").forEach(details => {
    const summary = details.querySelector("summary");
    const content = details.querySelector(".faq-content");

    summary.addEventListener("click", e => {
        e.preventDefault();

        if (details.open) {
            // Closing animation
            content.style.height = content.scrollHeight + "px";

            requestAnimationFrame(() => {
                content.style.height = "0px";
            });

            content.addEventListener("transitionend", function handler() {
                details.open = false;
                content.removeEventListener("transitionend", handler);
            });

        } else {
            // Opening animation
            details.open = true;
            content.style.height = content.scrollHeight + "px";

            content.addEventListener("transitionend", function handler() {
                content.style.height = "auto";
                content.removeEventListener("transitionend", handler);
            });
        }
    });
});
