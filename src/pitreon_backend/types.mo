import Principal "mo:base/Principal";
import Nat32 "mo:base/Nat32";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Array "mo:base/Array";
import Map "mo:map/Map";

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
        followers : Map.Map<Principal, Follower>;
        supporters : Map.Map<Principal, Supporter>;
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
    public type FullPatron = {
        name : Text;
        urlParam : Text;
        shortDescription : Text;
        fullDescription : Text;
        xAccount : Text;
        ytAccount : Text;
        followers : [Follower];
        supporters : [Supporter];
    };
    public type Follower = {
        principal : Principal;
        created : Time.Time;
    };
    public type Supporter = {
        principal : Principal;
        monthlyCommitment : Nat32; // In cents of ICP
        active: Bool;
        created : Time.Time;
        updated : Time.Time;
    };
};