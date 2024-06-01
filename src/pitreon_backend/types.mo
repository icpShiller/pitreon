import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import Time "mo:base/Time";
module {
    public type Patron = {
        created : Time.Time;
        updated : Time.Time;
        principal : Principal;
        name : Text;
        urlParam : Text;
        shortDescription : Text;
        fullDescription : Text;
        xAccount : Text;
        ytAccount : Text;
        //pfImage : Blob;
        //bgImage : Blob;
        balance : Nat32;
        followers : [ProtectedPatron];
        following : [ProtectedPatron];
        supporters : [ProtectedPatron];
        supporting : [ProtectedPatron];
    };
    public type ProtectedPatron = {
        name : Text;
        urlParam : Text;
        shortDescription : Text;
        fullDescription : Text;
        xAccount : Text;
        ytAccount : Text;
        followerCount : Nat;
        supporterCount : Nat;
    };

    // Types for handling ICP
    //public type Account = { owner : Principal; subaccount : ?Blob };
    /* public type AccountIdentifier = Blob;
    public type AccountBalanceArgs = { account : AccountIdentifier };
    public type Allowance = { allowance : Nat; expires_at : ?Nat64 };
    public type AllowanceArgs = { account : AccountIdentifier; spender : AccountIdentifier };
    public type ApproveArgs = {
        fee : ?Nat;
        memo : ?Blob;
        from_subaccount : ?Blob;
        created_at_time : ?Nat64;
        amount : Nat;
        expected_allowance : ?Nat;
        expires_at : ?Nat64;
        spender : AccountIdentifier;
    };
    public type ApproveError = {
        #GenericError : { message : Text; error_code : Nat };
        #TemporarilyUnavailable;
        #Duplicate : { duplicate_of : Nat };
        #BadFee : { expected_fee : Nat };
        #AllowanceChanged : { current_allowance : Nat };
        #CreatedInFuture : { ledger_time : Nat64 };
        #TooOld;
        #Expired : { ledger_time : Nat64 };
        #InsufficientFunds : { balance : Nat };
    }; */
};