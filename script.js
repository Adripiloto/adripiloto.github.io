betBtn.addEventListener("click", async () => {
    try {
        const response = await fetch("YOUR_NETLIFY_FUNCTION_URL/initiate-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 0.1, memo: "Slot machine bet" })
        });

        const data = await response.json();

        if (data.success) {
            playBtn.disabled = false;
            resultText.textContent = "Apuesta realizada correctamente.";
        } else {
            resultText.textContent = "Error al realizar la apuesta.";
        }
    } catch (err) {
        resultText.textContent = "Error al realizar la apuesta.";
    }
});
