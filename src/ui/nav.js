export function updateActiveNavLink(currentHash) {
    const navLinks = document.querySelectorAll('.main-nav ul li a');
    navLinks.forEach(link => {
        const linkHash = link.getAttribute('href') || '#';
        const normalizedCurrentHash = (currentHash === '' || currentHash === '#') ? '#' : currentHash;

        if (linkHash === normalizedCurrentHash) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}
