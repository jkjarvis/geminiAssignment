class Mixer {

  // initializing the mixer object
  constructor() {
    this.mixerUsers = [];
    this.pool = new MixerPool();
    this.transactions = [];
    this.previousTransactions = [];
  }

  // add user method to add new users along with their wallet address and outputAddresses
  addUser(userAddress, outputAddresses = []) {
    const newUser = new MixerUser(userAddress, outputAddresses);
    this.mixerUsers.push(newUser);
  }

  // transaction method for the mixer , this is the method called when a user sends their funds to the mixer.
  // this requires the user wallet address and output addresses
  transaction(senderAddress, numberOfCoins){
    // Verify Transaction and sender
    // Find the sender's MixerUser object
    const senderUser = this.mixerUsers.find(user => user.originalAddress === senderAddress);
    if (!senderUser) {
      throw new Error(`Sender ${sender} not found in mixer users.`);
    }

    // checking the transaction amount for minimum fee requirements
    if(numberOfCoins < 20){
      throw new Error(`Number of coins must be than 20`);
    }

    // Create transaction object and store the transaction details and then add this to the list of transactions
    const transactionObject = new Transaction(senderAddress, numberOfCoins);
    this.transactions.push(transactionObject);


    // transfer the coins to the pool wallet address and increment pool coins count
    // Increment the pool coins count
    const poolAddress = this.pool.getAddress(); 
    // transact as per the official mechanism, need to implement here
    // send these coins to the pool's wallet address


    // while sending to the wallet address, we can implement coin mixing among some existing addresses

    // send 20 coins to a separate pool address as fee and rest to the pool wallet
    this.pool.addCoins(numberOfCoins-20);
    
  }

  transactToOutputAddresses(){
    let transactionIndex = 0;
    for(const transaction of this.transactions){
      const senderUser = this.mixerUsers.find(user => user.originalAddress === transaction.senderAddress);
      if (!senderUser) {
        throw new Error(`Sender ${sender} not found in mixer users.`);
      }

      const allocationPerOutputAddress = senderUser.outputAddressAllocation;
      const outputAddresses = senderUser.outputAddress;

      if(outputAddresses.length < 1){
        throw new Error(`No output address for user with wallet address: ${senderUser.originalAddress}`);
      }

      for(const address of outputAddresses) {
        let allocation = allocationPerOutputAddress[address];

        if(allocation === undefined || allocation === null){
          throw new Error(`No allocation found for address: ${address}`);
        }

        // considering the allocation is in percentage, dividing product of total transaction value and percentage by 100
        let numberOfCoinsToSend = (transaction.numberOfCoins*allocation)/100;

        // do the transaction
        // senderAddress = mixer address
        // numberOfCoinsToSend = numberOfCoinsToSend
        // receiving address = outputAddress selected

        // update transaction status
        transaction.coinsForwarded = true;

        // removing the transaction from current list and moving to previous transaction list
        this.transaction.splice(transactionIndex, 1);
        transactionIndex += 1;
        this.previousTransactions.push(transaction);
      }
      

    }
  }
}

class Transaction{
  constructor(senderAddress, numberOfCoins){
    this.senderAddress = senderAddress;
    this.numberOfCoins = numberOfCoins;
    this.coinsForwarded = false;
  }
}

class MixerPool{
    constructor(){
        this.totalCoins = 0;
        this.address = "POOL_ADDRESS_HERE";
    }

    getAddress(){
      return this.address;
    }

    addCoins(numberOfCoins){
      this.totalCoins += numberOfCoins;
    }

    removeCoins(numberOfCoins){
      this.totalCoins -= numberOfCoins;
    }

}

class MixerUser {
  constructor(userOriginalAddress, outputAddress=null) {
    this.originalAddress = userOriginalAddress;
    this.outputAddress = outputAddress ? [outputAddress] : [];
    this.outputAddressAllocation = {};
  }

  addAddress(address) {
    this.outputAddress.push(address);
  }

  addAllocationForAddress(outputAddress, allocation) {
    this.outputAddressAllocation[outputAddress] = allocation;
  }
}


// create a mixer instance
const mixer = new Mixer();

// add the user to the mixer
mixer.addUser("address123", ["address456", "address789"]);

// create a transaction 
mixer.transaction("address123", 40);

// send the required coins to the output addresses
mixer.transactToOutputAddresses();