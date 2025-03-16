// Asegúrate de que Pi esté inicializado
Pi.init({ version: "2.0", sandbox: true });

const scopes = ['payments', 'username'];
let accessToken;

Pi.authenticate(scopes, function(payment) {
    console.log("Incomplete payment found:", payment);
}).then(function(auth) {
    accessToken = auth.accessToken;
    console.log("Autenticación exitosa:", auth);
}).catch(function(error) {
    console.error("Error de autenticación:", error);
});

function sendPaymentApprove(paymentDTO) {
    console.log("Enviando solicitud POST a:", "http://127.0.0.1:5000/payment/approve");
    console.log("Datos:", {
        paymentId: paymentDTO.identifier,
        accessToken: accessToken,
    });
    fetch("http://127.0.0.1:5000/payment/approve", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            paymentId: paymentDTO.identifier,
            accessToken: accessToken,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log("Respuesta de /payment/approve:", data);
    })
    .catch(error => {
        console.error("Error en /payment/approve:", error);
    });
}

// Repite el patrón para las otras rutas: sendPaymentComplete, sendPaymentCancel, sendPaymentError, sendMe

function createPayment() {
    const paymentData = {
        amount: 0.01,
        memo: "Test payment",
        metadata: { orderId: 123 }
    };

    const paymentCallbacks = {
        onReadyForServerApproval: (paymentDTO) => {
            sendPaymentApprove(paymentDTO);
        },
        onReadyForServerCompletion: (paymentDTO, txid) => {
            // Implementa sendPaymentComplete
        },
        onCancel: (paymentDTO) => {
            // Implementa sendPaymentCancel
        },
        onError: (paymentDTO) => {
            // Implementa sendPaymentError
        },
        onIncompletePaymentFound: (paymentDTO) => {
            // Implementa sendPaymentComplete
        }
    };

    Pi.createPayment(paymentData, paymentCallbacks);
}

// Asigna createPayment al evento click de tu botón de pago
document.getElementById('betBtn').addEventListener('click', createPayment);
