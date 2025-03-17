document.getElementById("auth-button").addEventListener("click", function() {
    console.log("Botón de iniciar sesión presionado");

    Pi.init({
        version: "2.0",  // Usa la versión más reciente
        appId: "sxfmtqkdbp2hp5v8rmyismfc4brgjbmbjtxakzeitelrlnvkdng04gieebb70e3u",  // Cambia esto por tu ID de app en Pi Network
        sandbox: true  // Deja en 'true' para pruebas, cambia a 'false' para producción
    });

    Pi.authenticate(["username", "payments"], function(user) {
        console.log("Usuario autenticado:", user);
        alert(`¡Bienvenido, ${user.username}!`);
    }).catch(function(error) {
        console.error("Error al autenticar:", error);
    });
});