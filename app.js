// Función que maneja los pagos incompletos
function onIncompletePaymentFound(payment) {
    console.log("Pago incompleto encontrado:", payment);
}

// Función para autenticar al usuario y obtener los datos de Pi
document.getElementById("auth-button").addEventListener("click", function() {
    const Pi = window.Pi;

    const scopes = ['username', 'payments'];  // Solicitar permisos de username y pagos

    Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
        console.log("Usuario autenticado:", auth);
        document.getElementById("welcome-message").textContent = `Bienvenido, ${auth.user.username}!`;

        // Ahora que el usuario está autenticado, puedes realizar un pago
        const paymentData = {
            amount: 1,  // La cantidad de Pi que el usuario desea apostar
            memo: 'Pago para jugar al slot',
            metadata: { InternalPaymentID: 1234 },  // Información extra
        };

        const paymentCallbacks = {
            onReadyForServerApproval: function(paymentId) {
                console.log("Pago listo para la aprobación en el servidor:", paymentId);
            },
            onReadyForServerCompletion: function(paymentId, txid) {
                console.log("Pago completado con éxito:", paymentId, txid);
            },
            onCancel: function(paymentId) {
                console.log("Pago cancelado:", paymentId);
            },
            onError: function(error, payment) {
                console.error("Error de pago:", error, payment);
            }
        };

        Pi.createPayment(paymentData, paymentCallbacks).then(function(payment) {
            console.log("Pago realizado:", payment);
        }).catch(function(error) {
            console.error("Error al crear el pago:", error);
        });

    }).catch(function(error) {
        console.error("Error de autenticación:", error);
    });
});
