function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-bs-theme');
    const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Cambiamos el atributo que lee el CSS
    html.setAttribute('data-bs-theme', targetTheme);
    
    // Actualizamos visualmente el botón
    document.getElementById('themeIcon').innerText = targetTheme === 'dark' ? '☀️' : '🌙';
    document.getElementById('btnText').innerText = targetTheme === 'dark' ? 'MODO CLARO' : 'MODO OSCURO';
    
    // Guardamos la preferencia
    localStorage.setItem('theme', targetTheme);
}