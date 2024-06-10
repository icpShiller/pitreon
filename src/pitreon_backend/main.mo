import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Random "mo:base/Random";
import Bool "mo:base/Bool";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Nat64 "mo:base/Nat64";
import Error "mo:base/Error";
import Result "mo:base/Result";
import Types "types";
import IcpLedger "canister:icp_ledger";

actor {
    type Patron = Types.Patron;
    type ProtectedPatron = Types.ProtectedPatron;
    let patrons = HashMap.HashMap<Principal,Patron>(0, Principal.equal, Principal.hash);
    type AccountIdentifier = IcpLedger.AccountIdentifier;
    type AccountBalanceArgs = IcpLedger.AccountBalanceArgs;

    public shared ({ caller }) func approve(allowance : Nat) : async Result.Result<IcpLedger.BlockIndex, Text> {
        let approveArgs : IcpLedger.ApproveArgs = {
            spender = {
                owner = caller;
                subaccount = null;
            };
            from_subaccount = null;
            amount = 10000000000000;
            expected_allowance = ?allowance;
            expires_at = null;
            fee = ?10000;
            memo = null;
            created_at_time = null;
        };
        try {
            let approvalResult : IcpLedger.ApproveResult = await IcpLedger.icrc2_approve(approveArgs);
            // check if the approval was successfull
            switch (approvalResult) {
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

    public func monitorBalances() : async Text {
        let marc : AccountIdentifier = await IcpLedger.account_identifier({ owner = Principal.fromText("n76ok-avh63-rv6wf-q4uln-xp2zs-7t3ke-n5dmi-6q6aw-na47f-westg-2qe"); subaccount = null});
        let pierre : AccountIdentifier = await IcpLedger.account_identifier({ owner = Principal.fromText("lrxp2-af2et-nvs3c-mswyc-solyt-uwzbh-o5dqy-25d2c-m6eyp-kmlsc-tae"); subaccount =  null});
        let marcAccountBalanceArgs : AccountBalanceArgs = { account = marc };
        let pierreAccountBalanceArgs : AccountBalanceArgs = { account = pierre };
        let marcBalance = await IcpLedger.account_balance(marcAccountBalanceArgs);
        let pierreBalance = await IcpLedger.account_balance(pierreAccountBalanceArgs);
        return "Marc: " # Nat64.toText(marcBalance.e8s) # "; Pierre: " # Nat64.toText(pierreBalance.e8s);
    };


    public shared ({ caller }) func addPatron(name : Text) : async ?Text {
        switch (patrons.get(caller)) {
            case (null) {
                let random = await generateRandomId();
                let urlParam = urlEncode(name) # "-" # random;
                let patron : Patron = {
                    created = Time.now();
                    updated = Time.now();
                    principal = caller;
                    name;
                    urlParam;
                    shortDescription = "This is your bio. It should be kept short.";
                    fullDescription = "This is a long description of yourself, depicting how you are helping ICP grow.";
                    xAccount = "https://x.com/taler_dao";
                    ytAccount = "https://www.youtube.com/@epicchess2021";
                    //pfImage = null;
                    //bgImage = null;
                    balance = 0;
                    followers = [];
                    following = [];
                    supporters = [];
                    supporting = [];
                };
                patrons.put(caller, patron);
                return ?urlParam;
            };
            case (?patron) {
                return null;
            };
        };
    };

    public shared ({ caller }) func updatePatron({ name : Text; shortDescription : Text; ytAccount : Text; xAccount : Text}) : async ?Text {
        let patron = patrons.get(caller);
        switch (patron) {
            case (?patron) {
                let updatedPatron : Patron = {
                    created = patron.created;
                    updated = Time.now();
                    principal = patron.principal;
                    name;
                    urlParam = patron.urlParam;
                    shortDescription;
                    fullDescription = patron.fullDescription;
                    xAccount;
                    ytAccount;
                    //pfImage = null;
                    //bgImage = null;
                    balance = patron.balance;
                    followers = patron.followers;
                    following = patron.following;
                    supporters = patron.supporters;
                    supporting = patron.supporting;
                };
                patrons.put(caller, updatedPatron);
                return ?"Success";
            };
            case (null) {
                return null;
            };
        };
    };

    public shared ({ caller }) func updateFullDescription( fullDescription : Text ) : async ?Text {
        let patron = patrons.get(caller);
        switch (patron) {
            case (?patron) {
                let updatedPatron : Patron = {
                    created = patron.created;
                    updated = Time.now();
                    principal = patron.principal;
                    name = patron.name;
                    urlParam = patron.urlParam;
                    shortDescription = patron.shortDescription;
                    fullDescription;
                    xAccount = patron.xAccount;
                    ytAccount = patron.ytAccount;
                    //pfImage = null;
                    //bgImage = null;
                    balance = patron.balance;
                    followers = patron.followers;
                    following = patron.following;
                    supporters = patron.supporters;
                    supporting = patron.supporting;
                };
                patrons.put(caller, updatedPatron);
                return ?"Success";
            };
            case (null) {
                return null;
            };
        };
    };

    func urlEncode(url : Text) : Text {
        let encodedUrl = Text.replace(Text.trim(url, #char ' '), #char ' ', "-");

        return encodedUrl;
    };

    public shared func generateRandomId() : async Text {
        let random = Random.Finite(await Random.blob()).range(32);
        switch (random) {
            case (null) {
                return "123456";
            };
            case (?random) {
                return Nat.toText(random);
            };
        };
    };

    public shared ({ caller }) func isPageOwner(urlParam : Text) : async Bool {
        let patron = await getPatron(caller);
        switch (patron) {
            case (?patron) {
                return patron.urlParam == urlParam;
            };
            case (null) {
                return false;
            }
        };
    };

    public shared ({ caller }) func getProfileLink() : async Text {
        let patron = await getPatron(caller);
        switch (patron) {
            case (?patron) {
                return "/profile/" # patron.urlParam;
            };
            case (null) {
                return "/create-patreon";
            }
        };
    };

    public query func getPatronInfo(urlParam : Text) : async ?ProtectedPatron {
        for (p in patrons.vals()) {
            if (p.urlParam == urlParam) {
                let pp : ProtectedPatron = {
                    name = p.name;
                    urlParam = p.urlParam;
                    shortDescription = p.shortDescription;
                    fullDescription = p.fullDescription;
                    xAccount = p.xAccount;
                    ytAccount = p.ytAccount;
                    followerCount = Array.size<ProtectedPatron>(p.followers);
                    supporterCount = Array.size<ProtectedPatron>(p.supporters);
                };
                return ?pp;
            };
        };
        return null;
    };

    public query func getPatron(principal : Principal) : async ?Patron {
        return patrons.get(principal);
    };

    public query func getAllPatrons() : async [Patron] {
        return Iter.toArray(patrons.vals());
    };

    public func dropAllPatrons() : async () {
        for (principal in patrons.keys()) {
            patrons.delete(principal);
        };
        return;
    };

    public query ({ caller }) func whoami() : async Text {
        return Principal.toText(caller);
    };
};
