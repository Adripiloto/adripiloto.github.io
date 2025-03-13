const backendUrl = "http://localhost:3000"; // URL de tu backend local

async function placeBet() {
    try {
        const scopes = ["payments"];
        
        // Iniciar sesión con Pi Network
        Pi.authenticate(scopes, async (user) => {
            console.log("Usuario autenticado:", user);
            
            // Enviar solicitud al backend para crear pago
            const response = await fetch(`${backendUrl}/create-payment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userUid: user.uid })
            });

            const data = await response.json();

            if (data.success) {
                alert("Apuesta realizada con éxito. ID de pago: " + data.paymentId);
            } else {
                alert("Error al realizar la apuesta.");
            }
        }, (error) => {
            console.error("Error de autenticación:", error);
            alert("Error al autenticarse con Pi Network.");
        });
    } catch (error) {
        console.error("Error al realizar la apuesta:", error);
    }
}

// Vincular la función al botón de apostar
document.getElementById("betButton").addEventListener("click", placeBet);
