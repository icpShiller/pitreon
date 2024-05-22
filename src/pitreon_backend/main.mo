import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Random "mo:base/Random";
import Nat16 "mo:base/Nat16";
import Bool "mo:base/Bool";
import Error "mo:base/Error";
import Option "mo:base/Option";
import Array "mo:base/Array";
import Time "mo:base/Time";
import Types "types";
actor {
    type Patron = Types.Patron;
    type ProtectedPatron = Types.ProtectedPatron;
    type Result<Ok, Err> = Types.Result<Ok, Err>;
    let patrons = HashMap.HashMap<Principal,Patron>(0, Principal.equal, Principal.hash);

    public shared ({ caller }) func addPatron(name : Text) : async Result<(), Text> {
        switch (patrons.get(caller)) {
            case (null) {
                //let random = Random.Finite(await Random.blob());
                let patron : Patron = {
                    created = Time.now();
                    principal = caller;
                    name;
                    urlParam = name # "-1234";
                    description = "";
                    xAccount = "";
                    ytAccount = "";
                    //pfImage = null;
                    //bgImage = null;
                    balance = 0;
                    followers = [];
                    following = [];
                    supporters = [];
                    supporting = [];
                };
                patrons.put(caller, patron);
                return #ok();
            };
            case (?patron) {
                return #err("This patron already exists.");
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
                return patron.urlParam;
            };
            case (null) {
                return "new";
            }
        };
    };

    public query func getPatronInfo(urlParam : Text) : async ?ProtectedPatron {
        for (p in patrons.vals()) {
            if (p.urlParam == urlParam) {
                let pp : ProtectedPatron = {
                    name = p.name;
                    urlParam = p.urlParam;
                    description = p.description;
                    xAccount = p.xAccount;
                    ytAccount = p.ytAccount;
                    followerCount = Array.size<ProtectedPatron>(p.followers);
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
