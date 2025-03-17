document.getElementById("auth-button").addEventListener("click", function() {
    Pi.init({
        version: "2.0",  // Usa la versión más reciente
        appId: "TU_APP_ID_AQUÍ",  // Cambia esto por tu ID de app en Pi Network
        sandbox: true  // Deja en 'true' para pruebas, cambia a 'false' para producción
    });

    Pi.authenticate(["username", "payments"], function(user) {
        console.log("Usuario autenticado:", user);
        alert(`¡Bienvenido, ${user.username}!`);
    }).catch(function(error) {
        console.error("Error al autenticar:", error);
    });
});
