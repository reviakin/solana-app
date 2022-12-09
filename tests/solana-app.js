const anchor = require("@project-serum/anchor");

const { SystemProgram } = anchor.web3;

describe("solana-app", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  it("Is initialized!", async () => {
    // Add your test here.
    const program = anchor.workspace.SolanaApp;

    // generate an account keypair for our program to use.
    const baseAccount = anchor.web3.Keypair.generate();

    //const tx = await program.methods.initialize().rpc();
    let tx = await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });
    //const tx = await program.rpc.initialize
    console.log("Your transaction signature", tx);
    // Fetch data from the account.
    let account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log("👀 GIF Count", account.totalGifs.toString());

    let gifLink = "https://media.giphy.com/media/4qRMFEBkjcctsu8Gm0/giphy.gif";
    // Call add_gif!
    await program.rpc.addGif(gifLink, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });

    // Get the account again to see what changed.
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    console.log("👀 GIF Count", account.totalGifs.toString());

    console.log("👀 GIF List", account.gifList);
  });
});
