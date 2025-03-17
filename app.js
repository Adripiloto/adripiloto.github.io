// Asegurarnos de que el botón de inicio de sesión está funcionando
document.getElementById("auth-button").addEventListener("click", function () {
    console.log("Botón de inicio de sesión presionado.");

    // Inicializar Pi Network SDK
    Pi.init({
        version: "2.0",
        appId: "sxfmtqkdbp2hp5v8rmyismfc4brgjbmbjtxakzeitelrlnvkdng04gieebb70e3u", // Reemplaza con el ID real de tu app en Pi Network
        sandbox: true // Cambiar a false cuando pases a producción
    });

    // Autenticación del usuario
    Pi.authenticate(["username", "payments"], function (payment) {
        console.log("Pago incompleto encontrado:", payment);
    })
        .then(function (auth) {
            console.log("Usuario autenticado:", auth);
            document.getElementById("welcome-message").textContent = `Bienvenido, ${auth.user.username}!`;

            // Una vez autenticado, ofrecerle al usuario jugar apostando Pi
            iniciarPago();
        })
        .catch(function (error) {
            console.error("Error de autenticación:", error);
        });
});

// Función para iniciar un pago en la app de slots
function iniciarPago() {
    const paymentData = {
        amount: 1, // Monto de la apuesta en Pi
        memo: "Pago para jugar al slot",
        metadata: { InternalPaymentID: 1234 } // ID interno del pago (opcional)
    };

    const paymentCallbacks = {
        onReadyForServerApproval: function (paymentId) {
            console.log("Pago listo para aprobación:", paymentId);
        },
        onReadyForServerCompletion: function (paymentId, txid) {
            console.log("Pago completado con éxito:", paymentId, txid);
        },
        onCancel: function (paymentId) {
            console.log("Pago cancelado:", paymentId);
        },
        onError: function (error, payment) {
            console.error("Error en el pago:", error, payment);
        }
    };

    Pi.createPayment(paymentData, paymentCallbacks)
        .then(function (payment) {
            console.log("Pago realizado:", payment);
        })
        .catch(function (error) {
            console.error("Error al crear el pago:", error);
        });
}
