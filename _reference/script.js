// DOM Elements
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")
const navLinks = document.querySelectorAll(".nav-link")
const navbar = document.querySelector(".navbar")

// Image Gallery Functionality
let currentSlide = 0
const slides = document.querySelectorAll(".gallery-slide")
const dots = document.querySelectorAll(".dot")
const prevBtn = document.querySelector(".prev-btn")
const nextBtn = document.querySelector(".next-btn")

function showSlide(index) {
  // Hide all slides
  slides.forEach((slide) => slide.classList.remove("active"))
  dots.forEach((dot) => dot.classList.remove("active"))

  // Show current slide
  if (slides[index]) {
    slides[index].classList.add("active")
    dots[index].classList.add("active")
  }
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length
  showSlide(currentSlide)
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length
  showSlide(currentSlide)
}

// Event listeners for gallery
if (nextBtn) {
  nextBtn.addEventListener("click", nextSlide)
}

if (prevBtn) {
  prevBtn.addEventListener("click", prevSlide)
}

// Dot navigation
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentSlide = index
    showSlide(currentSlide)
  })
})

// Auto-advance gallery every 5 seconds
let galleryInterval = setInterval(nextSlide, 5000)

// Pause auto-advance on hover
const gallery = document.querySelector(".image-gallery")
if (gallery) {
  gallery.addEventListener("mouseenter", () => {
    clearInterval(galleryInterval)
  })

  gallery.addEventListener("mouseleave", () => {
    galleryInterval = setInterval(nextSlide, 5000)
  })
}

// Mobile Menu Toggle
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active")
  navMenu.classList.toggle("active")

  // Prevent body scroll when menu is open
  document.body.style.overflow = navMenu.classList.contains("active")
    ? "hidden"
    : "auto"
})

// Close mobile menu when clicking on nav links
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active")
    navMenu.classList.remove("active")
    document.body.style.overflow = "auto"
  })
})

// Navbar background change on scroll
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    navbar.style.background = "rgba(255, 255, 255, 0.98)"
    navbar.style.boxShadow = "0 2px 25px rgba(0, 0, 0, 0.15)"
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.95)"
    navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
  }
})

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      const offsetTop = target.offsetTop - 70 // Account for fixed navbar
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
  })
})

// Active navigation link highlighting
function updateActiveNavLink() {
  const sections = document.querySelectorAll("section[id]")
  const scrollPos = window.scrollY + 100

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")
    const correspondingNavLink = document.querySelector(
      `a[href="#${sectionId}"]`
    )

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach((link) => link.classList.remove("active"))
      if (correspondingNavLink) {
        correspondingNavLink.classList.add("active")
      }
    }
  })
}

window.addEventListener("scroll", updateActiveNavLink)

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-on-scroll")
      observer.unobserve(entry.target)
    }
  })
}, observerOptions)

// Observe elements for animation
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    ".feature-card, .research-card, .contact-item, .application-card, .publication-category"
  )
  animatedElements.forEach((el) => observer.observe(el))
})

// Notification system
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => notification.remove())

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === "success" ? "#8bc34a" : type === "error" ? "#f44336" : "#00bcd4"};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        max-width: 350px;
        transform: translateX(100%);
        transition: transform 0.3s ease-in-out;
        font-family: var(--font-family);
    `

  notification.querySelector(".notification-content").style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
    `

  notification.querySelector(".notification-close").style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `

  // Add to DOM
  document.body.appendChild(notification)

  // Trigger animation
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Close functionality
  const closeBtn = notification.querySelector(".notification-close")
  closeBtn.addEventListener("click", () => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => notification.remove(), 300)
  })

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => notification.remove(), 300)
    }
  }, 5000)
}

// Parallax effect for hero section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset
  const parallaxElements = document.querySelectorAll(".floating-shapes .shape")

  parallaxElements.forEach((element, index) => {
    const speed = 0.5 + index * 0.2
    element.style.transform = `translateY(${scrolled * speed}px)`
  })
})

// Lazy loading for images
const images = document.querySelectorAll("img[data-src]")
const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      img.classList.remove("loading")
      imageObserver.unobserve(img)
    }
  })
})

images.forEach((img) => imageObserver.observe(img))

// Theme toggle (optional feature)
function createThemeToggle() {
  const themeToggle = document.createElement("button")
  themeToggle.innerHTML = "🌙"
  themeToggle.setAttribute("aria-label", "Toggle dark mode")
  themeToggle.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-blue);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        transition: var(--transition-normal);
    `

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme")
    themeToggle.innerHTML = document.body.classList.contains("dark-theme")
      ? "☀️"
      : "🌙"
  })

  document.body.appendChild(themeToggle)
}

// Back to top button
function createBackToTopButton() {
  const backToTop = document.createElement("button")
  backToTop.innerHTML = "↑"
  backToTop.setAttribute("aria-label", "Back to top")
  backToTop.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: var(--secondary-teal);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        box-shadow: var(--shadow-lg);
        z-index: 1000;
        transition: var(--transition-normal);
        opacity: 0;
        visibility: hidden;
    `

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTop.style.opacity = "1"
      backToTop.style.visibility = "visible"
    } else {
      backToTop.style.opacity = "0"
      backToTop.style.visibility = "hidden"
    }
  })

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  document.body.appendChild(backToTop)
}

// Initialize additional features
document.addEventListener("DOMContentLoaded", () => {
  // createThemeToggle(); // Uncomment to enable theme toggle
  createBackToTopButton()

  // Add loading class to images without src
  const lazyImages = document.querySelectorAll("img:not([src])")
  lazyImages.forEach((img) => img.classList.add("loading"))
})

// Error handling for missing elements
window.addEventListener("error", (e) => {
  console.warn("Robotedge Website:", e.message)
})

// Performance optimization: Debounced scroll handler
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Apply debouncing to scroll-heavy functions
const debouncedScrollHandler = debounce(() => {
  updateActiveNavLink()
}, 10)

window.addEventListener("scroll", debouncedScrollHandler)

console.log("🤖 Robotedge website loaded successfully!")
