import Principal "mo:base/Principal";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Nat64 "mo:base/Nat64";
import Error "mo:base/Error";
import Result "mo:base/Result";
import IcpLedger "canister:icp_ledger";

actor {

    type AccountIdentifier = IcpLedger.AccountIdentifier;
    type AccountBalanceArgs = IcpLedger.AccountBalanceArgs;

    let godPrincipal : Principal = Principal.fromText("a5sm3-2jqyf-of34i-2y4rc-jras6-ll7yf-in4ha-5sply-anm4t-lwjzq-nae"); 
    let marcPrincipal : Principal = Principal.fromText("mrnwe-e34a4-ievgc-vg5to-54ohx-lenz5-mavi4-ccju3-gwqrw-ab3pw-lqe"); //10000
    let pierrePrincipal : Principal = Principal.fromText("wvuwo-kit73-ntdjm-mcphe-6hlwd-5mny2-3cmdq-eqwrk-mcgwv-y4wnu-gqe"); //10001
    let vaultPrincipal : Principal = Principal.fromText("oh4wx-aithl-wsfgj-bmmyy-fxz2g-gwl6e-usmxf-lr6yo-5xwjb-pyg64-rae"); //10002

    public shared func transfer(amount : Nat, fromPrincipal : Text) : async Result.Result<IcpLedger.BlockIndex, Text> {
        let transferFromArgs : IcpLedger.TransferFromArgs = {
            from = {
                owner = Principal.fromText(fromPrincipal);
                subaccount = null;
            };
            to = {
                owner = vaultPrincipal;
                subaccount = null;
            };
            spender_subaccount = null;
            amount = amount;
            fee = ?10_000;
            memo = null;
            created_at_time = null;
        };
        try {
            let transferFromResult : IcpLedger.TransferFromResult = await IcpLedger.icrc2_transfer_from(transferFromArgs);
            // check if the transfer was successfull
            switch (transferFromResult) {
                case (#Err(error)) {
                    return #err("Couldn't approve funds: " # debug_show (error));
                };
                case (#Ok(blockIndex)) { return #ok(Nat64.fromNat(blockIndex)) };
            };

        } catch (error) {
            return #err("Reject message: " # Error.message(error));
        }
    };

    public shared ({ caller }) func getBalance() : async Text {
        let account : AccountIdentifier = await IcpLedger.account_identifier({ owner = caller; subaccount = null});
        let accountBalanceArgs : AccountBalanceArgs = { account };
        let balance = await IcpLedger.account_balance(accountBalanceArgs);
        return "Balance: " # Nat64.toText(balance.e8s);
    };

    public shared func monitorBalances() : async Text {
        let god : AccountIdentifier = await IcpLedger.account_identifier({ owner = godPrincipal; subaccount =  null});
        let marc : AccountIdentifier = await IcpLedger.account_identifier({ owner = marcPrincipal; subaccount = null});
        let pierre : AccountIdentifier = await IcpLedger.account_identifier({ owner = pierrePrincipal; subaccount =  null});
        let vault : AccountIdentifier = await IcpLedger.account_identifier({ owner = vaultPrincipal; subaccount =  null});
        let godAccountBalanceArgs : AccountBalanceArgs = { account = god };
        let marcAccountBalanceArgs : AccountBalanceArgs = { account = marc };
        let pierreAccountBalanceArgs : AccountBalanceArgs = { account = pierre };
        let vaultAccountBalanceArgs : AccountBalanceArgs = { account = vault };
        let godBalance = await IcpLedger.account_balance(godAccountBalanceArgs);
        let marcBalance = await IcpLedger.account_balance(marcAccountBalanceArgs);
        let pierreBalance = await IcpLedger.account_balance(pierreAccountBalanceArgs);
        let vaultBalance = await IcpLedger.account_balance(vaultAccountBalanceArgs);
        return "God: " # Nat64.toText(godBalance.e8s) # "; Marc: " # Nat64.toText(marcBalance.e8s) # "; Pierre: " # Nat64.toText(pierreBalance.e8s) # "; Vault: " # Nat64.toText(vaultBalance.e8s);
    };
}