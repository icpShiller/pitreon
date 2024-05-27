import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import Time "mo:base/Time";
import Blob "mo:base/Blob";
module {
    public type Result<Ok, Err> = Result.Result<Ok, Err>;
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
};