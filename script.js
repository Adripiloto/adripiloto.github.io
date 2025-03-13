app.post("/initiate-payment", async (req, res) => {
    try {
        const { amount, memo } = req.body;
        const userUid = "test_user"; // Reemplaza cuando tengas autenticación

        const body = { amount, memo, metadata: { game: "slots" }, uid: userUid };
        const response = await axiosClient.post(`/v2/payments`, body, config);

        const paymentIdentifier = response.data.identifier;
        const recipientAddress = response.data.recipient;

        const myAccount = await piTestnet.loadAccount(MY_PUBLIC_KEY);
        const baseFee = await piTestnet.fetchBaseFee();
        const timebounds = await piTestnet.fetchTimebounds(180);

        const payment = Operation.payment({
            destination: recipientAddress,
            asset: Asset.native(),
            amount: amount.toString()
        });

        let transaction = new TransactionBuilder(myAccount, {
            fee: baseFee,
            networkPassphrase: "Pi Testnet",
            timebounds: timebounds
        }).addOperation(payment).addMemo(Memo.text(paymentIdentifier));

        transaction = transaction.build();
        const myKeypair = Keypair.fromSecret(MY_SECRET_SEED);
        transaction.sign(myKeypair);

        const txResponse = await piTestnet.submitTransaction(transaction);
        const txid = txResponse.id;

        const completeResponse = await axiosClient.post(`/v2/payments/${paymentIdentifier}/complete`, { txid }, config);

        res.json({ success: true, paymentId: paymentIdentifier });

    } catch (error) {
        console.error("Error en /initiate-payment:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});
