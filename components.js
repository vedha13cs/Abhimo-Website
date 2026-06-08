/**
 * Abhimo Technologies - Shared Components
 * This script injects the consistent Navbar and Footer across all pages.
 */

document.addEventListener("DOMContentLoaded", () => {
    injectNavbar();
    injectFooter();
    injectBackground();
});

function injectBackground() {
    if (!document.querySelector('.bg-circle')) {
        const bgHtml = `
            <div class="bg-circle circle1"></div>
            <div class="bg-circle circle2"></div>
            <div class="bg-circle circle3"></div>
        `;
        document.body.insertAdjacentHTML('afterbegin', bgHtml);
    }
}

function injectNavbar() {
    const navPlaceholder = document.querySelector('nav') || document.body;
    const isMainPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    const basePath = isMainPage ? '' : ''; // Currently all files are in the same directory

    const navbarHtml = `
    <nav class="navbar navbar-expand-lg fixed-top custom-navbar">
        <div class="container">
            <a class="navbar-brand logo-text" href="index">
                <img src="imagefile/imagefile/WhatsApp Image 2026-05-25 at 11.03.41 AM.jpeg" alt="Abhimo Logo"
                    class="logo-img">
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-lg-center gap-3">
                    <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
                    <li class="nav-item"><a class="nav-link" href="services.html">Services</a></li>
                    <li class="nav-item"><a class="nav-link" href="product.html">Products</a></li>
                    <li class="nav-item"><a class="nav-link" href="client.html">Clients</a></li>
                    <li class="nav-item"><a class="nav-link" href="internship.html">Internship</a></li>
                    <li class="nav-item"><a class="nav-link" href="gallery.html">Gallery</a></li>
                    <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
                    <li class="nav-item">
                        <a href="apply.html" class="btn apply-btn">Apply Now</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    `;

    if (document.querySelector('nav')) {
        document.querySelector('nav').outerHTML = navbarHtml;
    } else {
        document.body.insertAdjacentHTML('afterbegin', navbarHtml);
    }
}

function injectFooter() {
    const footerPlaceholder = document.querySelector('footer') || document.body;

    const footerHtml = `
    <footer class="footer">
        <div class="container">
            <div class="row g-5">
                <div class="col-lg-4 text-center text-lg-start">
                    <img src="imagefile/imagefile/WhatsApp Image 2026-05-25 at 11.03.41 AM.jpeg" alt="Abhimo Logo"
                        class="footer-logo mb-4">
                    <p class="text-secondary">
                        Abhimo Technologies Private Limited <br>
                        Innovative Software & Internship Platform providing industry-leading solutions and professional training.
                    </p>
                </div>
                <div class="col-lg-4 text-center">
                    <h4 class="footer-title">Quick Links</h4>
                    <div class="footer-nav">
                        <a href="index.html">Home</a>
                        <a href="about.html">About Us</a>
                        <a href="services.html">Our Services</a>
                        <a href="product.html">Our Products</a>
                        <a href="client.html">Our Clients</a>
                        <a href="internship.html">Internship</a>
                        <a href="gallery.html">Gallery</a>
                        <a href="contact.html">Contact Us</a>
                    </div>
                </div>
                <div class="col-lg-4 text-center text-lg-end">
                    <h4 class="footer-title">Join Our Journey</h4>
                    <p class="text-secondary mb-4">Scale your digital presence with our innovative software solutions.</p>
                    <!--sudeen-27/05/2026 manglore for justify text begin (REMOVED text-align: justify for mobile compatibility)-->
                    <style>
                        .text-secondary {
                            /* Inherit alignment from parent classes */
                        }
                        @media (min-width: 992px) {
                            .footer .text-lg-start .text-secondary {
                                text-align: justify;
                            }
                        }
                    </style>
                    <!--sudeen-27/05/2026 manglore for justify text end-->
                    <a href="apply.html" class="btn apply-btn">Apply for Internship</a>
                    <div class="social-icons mt-4">
                        <a href="https://www.facebook.com/people/Abhimo-Technologies/100063650032197/"><i class="bi bi-facebook"></i></a>
                        <a href="https://www.instagram.com/Abhimo_technologies"><i class="bi bi-instagram"></i></a>
                        <a href="https://www.linkedin.com/company/Abhimo-technologies-private-limited/"><i class="bi bi-linkedin"></i></a>
                        <a href="https://x.com/Abhimo1"><i class="bi bi-twitter-x"></i></a>
                    </div>
                </div>
            </div>
            <div class="copyright-text mt-5">
                © 2026 Abhimo Technologies Private Limited. All rights reserved.
                <br>
                Powered by <a href="https://www.abhimo.com" target="_blank">Abhimo Technologies</a>
            </div>
        </div>
    </footer>
    `;

    if (document.querySelector('footer')) {
        document.querySelector('footer').outerHTML = footerHtml;
    } else {
        document.body.insertAdjacentHTML('beforeend', footerHtml);
    }
}
