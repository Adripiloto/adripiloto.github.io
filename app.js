// Inicializar Pi Network SDK al cargar la página
Pi.init({
    version: "2.0",
    sandbox: true, // Cambiar a false en producción
    appId: "sxfmtqkdbp2hp5v8rmyismfc4brgjbmbjtxakzeitelrlnvkdng04gieebb70e3u" // Tu App ID de Pi Network
});

// Manejar autenticación del usuario al hacer clic en "Iniciar Sesión"
document.getElementById("auth-button").addEventListener("click", function () {
    console.log("Botón de inicio de sesión presionado.");

    Pi.authenticate(["username", "payments"], function (payment) {
        console.log("Pago incompleto encontrado:", payment);
    })
    .then(function (auth) {
        console.log("Usuario autenticado:", auth);
        document.getElementById("welcome-message").textContent = `Bienvenido, ${auth.user.username}!`;

        // Mostrar el botón de jugar después de autenticarse
        document.getElementById("play-button").style.display = "block";
    })
    .catch(function (error) {
        console.error("Error de autenticación:", error);
    });
});

// Manejar el pago cuando el usuario haga clic en "Jugar"
document.getElementById("play-button").addEventListener("click", function () {
    console.log("Botón de jugar presionado.");

    const paymentData = {
        amount: 1, // Monto de la apuesta en Pi
        memo: "Pago para jugar al slot",
        metadata: { InternalPaymentID: Math.floor(Math.random() * 10000) } // ID interno aleatorio
    };

    const paymentCallbacks = {
        onReadyForServerApproval: function (paymentId) {
            console.log("Pago listo para aprobación:", paymentId);
        },
        onReadyForServerCompletion: function (paymentId, txid) {
            console.log("Pago completado con éxito:", paymentId, txid);
            alert("¡Pago exitoso! Ahora puedes jugar.");
        },
        onCancel: function (paymentId) {
            console.log("Pago cancelado:", paymentId);
            alert("Pago cancelado.");
        },
        onError: function (error, payment) {
            console.error("Error en el pago:", error, payment);
            alert("Ocurrió un error con el pago.");
        }
    };

    Pi.createPayment(paymentData, paymentCallbacks)
        .then(function (payment) {
            console.log("Pago realizado:", payment);
        })
        .catch(function (error) {
            console.error("Error al crear el pago:", error);
        });
});
