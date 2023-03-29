const { Client, AccountId, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction } = require("@hashgraph/sdk");

require("dotenv").config();

async function main() {
    if (process.env.MY_ACCOUNT_ID == null || process.env.MY_PRIVATE_KEY == null) {
        throw new Error(
            "Environment variables OPERATOR_ID, and OPERATOR_KEY are required."
        );
    }

    //setting my accountId and my privateKey
    const myAccountId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

    //setting the client for testNet by using myAccountId and myPrivateKey
    const client = Client.forTestnet().setOperator(myAccountId, myPrivateKey);

    //generating ED25519 private Key and public key
    const newAccountPrivateKey = PrivateKey.generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    const mynewAccountBalance = await new AccountBalanceQuery().setAccountId(myAccountId).execute(client);
console.info("my acc balance before txn : "+mynewAccountBalance.hbars);
    //creating new account with the help of generated private key
    const newAccount = await new AccountCreateTransaction().setKey(newAccountPublicKey)
    // .setInitialBalance(Hbar.from(10))
    .execute(client);

    //getting the new a/c id
    const accountCreationReceipt = await newAccount.getReceipt(client);
    const newAccountId = accountCreationReceipt.accountId;
    console.info('new account ID : ' + newAccountId.toString());

    const mynewAccountBalance2 = await new AccountBalanceQuery().setAccountId(myAccountId).execute(client);
    console.info("my acc bal after creating a new account: "+ mynewAccountBalance2.hbars);

    
    //verify the balance of newAccountId
    const newAccountBalance = await new AccountBalanceQuery().setAccountId(newAccountId).execute(client);
    console.info('new account balance : ' + newAccountBalance.hbars);

    const mynewAccountBalance1 = await new AccountBalanceQuery().setAccountId(myAccountId).execute(client);
    console.info("my acc bal after checking balance : "+mynewAccountBalance1.hbars);

    // transfer Hbar1 to the newly created Account

    //creating a transfer transation
    const sendHbar = await new TransferTransaction()
        .addHbarTransfer(myAccountId, Hbar.fromTinybars(-1000))//sender account
        .addHbarTransfer(newAccountId, Hbar.fromTinybars(1000))//receiver account
        .execute(client);

    //verifying the transfer transaction has reached consensus or not
    const transaferTxnReceipt = await sendHbar.getReceipt(client);
    console.info('Status of transfer transaction : ' + transaferTxnReceipt.status.toString());

    //querying the cost of the query 
    const queryCostOfQuery = await new AccountBalanceQuery().setAccountId(newAccountId).getCost(client);
    console.info('cost of the accountBalanceQuery will be : ' + queryCostOfQuery.toTinybars() + ' tinybars');

    //getting the balance of the newly created account
    const getNewAccountBalance = await new AccountBalanceQuery().setAccountId(newAccountId).execute(client);
    console.info('New Account balance : ' + getNewAccountBalance.hbars);
    const getNewAccountBalanceAgain = await new AccountBalanceQuery().setAccountId(newAccountId).execute(client);
    console.info('Checking New Account balance Again : ' + getNewAccountBalanceAgain.hbars);


    //getting the balance of my account
    const getMyAccountBalance = await new AccountBalanceQuery().setAccountId(myAccountId).execute(client);
    console.info('My Account balance : ' + getMyAccountBalance.hbars.toTinybars() + ' tinybars');
    console.info('My Account balance : ' + getMyAccountBalance.hbars );

    const getMyAccountBalanceAgain = await new AccountBalanceQuery().setAccountId(myAccountId).execute(client);
    console.info('Checking My Account balance Again : ' + getMyAccountBalanceAgain.hbars );





}

void main();