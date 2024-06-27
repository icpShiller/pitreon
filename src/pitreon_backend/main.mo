import Principal "mo:base/Principal";
import Random "mo:base/Random";
import Bool "mo:base/Bool";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Buffer "mo:base/Buffer";
import Nat8 "mo:base/Nat8";
import Map "mo:map/Map";
import { phash } "mo:map/Map";
import Types "types";

actor {
    type Patron = Types.Patron;
    type ProtectedPatron = Types.ProtectedPatron;
    type FullPatron = Types.FullPatron;
    type Follower = Types.Follower;
    type Supporter = Types.Supporter;
    type Result<Ok, Err> = Types.Result<Ok, Err>;

    stable let patrons = Map.new<Principal,Patron>();

    /////// WRITE ///////

    public shared ({ caller }) func addPatron(name : Text) : async Result<Text, Text> {
        switch (Map.has<Principal, Patron>(patrons, phash, caller)) {
            case (false) {
                let random = await generateRandomId();
                let urlParam = urlEncode(name) # "-" # random;
                let followers = Map.new<Principal,Follower>();
                let supporters = Map.new<Principal,Supporter>();
                let patron : Patron = {
                    created = Time.now();
                    updated = Time.now();
                    principal = caller;
                    name;
                    urlParam;
                    shortDescription = "This is your bio. It should be kept short.";
                    fullDescription = "This is a long description of yourself, depicting how you are helping ICP grow.";
                    xAccount = "";
                    ytAccount = "";
                    //pfImage = null;
                    //bgImage = null;
                    balance = 0;
                    followers;
                    supporters;
                };
                Map.setFront<Principal, Patron>(patrons, phash, caller, patron);
                return #ok(urlParam);
            };
            case (_) {
                return #err("A profile already exists for this principal.");
            };
        };
    };

    public shared ({ caller }) func updatePatron({ name : Text; shortDescription : Text; ytAccount : Text; xAccount : Text}) : async Result<Text, Text> {
        let patron = Map.get<Principal, Patron>(patrons, phash, caller);
        switch (patron) {
            case (?patron) {
                if (name == "") {
                    return #err("Profile name cannot be empty.");
                };

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
                    supporters = patron.supporters;
                };
                Map.setFront(patrons, phash, caller, updatedPatron);
                return #ok("Success");
            };
            case (_) {
                return #err("Looks like the patreon page you're trying to update doesn't exist anymore.");
            };
        };
    };

    public shared ({ caller }) func updateFullDescription( fullDescription : Text ) : async Result<Text, Text> {
        let patron = Map.get<Principal, Patron>(patrons, phash, caller);
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
                    supporters = patron.supporters;
                };
                Map.setFront<Principal, Patron>(patrons, phash, caller, updatedPatron);
                return #ok("Success");
            };
            case (_) {
                return #err("Looks like the patreon page you're trying to update doesn't exist anymore.");
            };
        };
    };

    public shared func toggleFollower(followerPrincipal : Text, urlParam : Text) : async Result<Bool, Text> {
        for (patron in Map.vals<Principal, Patron>(patrons)) {
            if (patron.urlParam == urlParam) {
                let followers = patron.followers;
                var followed = false;
                let follower = Principal.fromText(followerPrincipal);
                if (Map.has<Principal, Follower>(followers, phash, follower)) {
                    Map.delete<Principal, Follower>(followers, phash, follower);
                } else {
                    let newFollower : Follower = {
                        principal = follower;
                        created = Time.now();
                    };
                    Map.set<Principal, Follower>(followers, phash, follower, newFollower);
                    followed := true;
                };
                let updatedPatron : Patron = {
                    created = patron.created;
                    updated = Time.now();
                    principal = patron.principal;
                    name = patron.name;
                    urlParam = patron.urlParam;
                    shortDescription = patron.shortDescription;
                    fullDescription = patron.fullDescription;
                    xAccount = patron.xAccount;
                    ytAccount = patron.ytAccount;
                    //pfImage = null;
                    //bgImage = null;
                    balance = patron.balance;
                    followers;
                    supporters = patron.supporters;
                };
                Map.setFront<Principal, Patron>(patrons, phash, patron.principal, updatedPatron);

                return #ok(followed);
            };
        };
        return #err("Followee not found.");
    };

    public shared func toggleSupporter(supporterPrincipal : Text, urlParam : Text, amount : Nat32, active : Bool) : async Result<(Nat32, Bool), Text> {
        for (patron in Map.vals<Principal, Patron>(patrons)) {
            if (patron.urlParam == urlParam) {
                let supporters = patron.supporters;
                let supporter = Principal.fromText(supporterPrincipal);
                var created = Time.now();
                if (Map.has<Principal, Supporter>(supporters, phash, supporter)) {
                    let supp = Map.get<Principal, Supporter>(supporters, phash, supporter);
                    switch (supp) {
                        case (null) {
                            created := Time.now();
                        };
                        case (?supp) {
                            created := supp.created;
                        };
                        case (_) {
                            return #err("Error retrieving supporter created time.");
                        };
                    }
                    
                };
                let newSupporter : Supporter = {
                    principal = supporter;
                    monthlyCommitment = amount;
                    active;
                    created;
                    updated = Time.now();
                };
                Map.set<Principal, Supporter>(supporters, phash, supporter, newSupporter);
                let updatedPatron : Patron = {
                    created = patron.created;
                    updated = Time.now();
                    principal = patron.principal;
                    name = patron.name;
                    urlParam = patron.urlParam;
                    shortDescription = patron.shortDescription;
                    fullDescription = patron.fullDescription;
                    xAccount = patron.xAccount;
                    ytAccount = patron.ytAccount;
                    //pfImage = null;
                    //bgImage = null;
                    balance = patron.balance;
                    followers = patron.followers;
                    supporters;
                };
                Map.setFront<Principal, Patron>(patrons, phash, patron.principal, updatedPatron);
                
                return #ok((amount,active));
            };
        };
        return #err("Followee not found.");
    };

    /////// READ ///////

    public query ({ caller }) func isPageOwner(urlParam : Text) : async Bool {
        let patron = Map.get<Principal, Patron>(patrons, phash, caller);
        switch (patron) {
            case (?patron) {
                return patron.urlParam == urlParam;
            };
            case (null) {
                return false;
            }
        };
    };

    public query ({ caller }) func getProfileLink() : async Text {
        let patron = Map.get<Principal, Patron>(patrons, phash, caller);
        switch (patron) {
            case (?patron) {
                return "/profile/" # patron.urlParam;
            };
            case (null) {
                return "/create-patreon";
            }
        };
    };

    public query func getPatronInfo(urlParam : Text) : async Result<?ProtectedPatron, Text> {
        for (p in Map.vals<Principal, Patron>(patrons)) {
            if (p.urlParam == urlParam) {
                let pp : ProtectedPatron = {
                    name = p.name;
                    urlParam = p.urlParam;
                    shortDescription = p.shortDescription;
                    fullDescription = p.fullDescription;
                    xAccount = p.xAccount;
                    ytAccount = p.ytAccount;
                    followerCount = Map.size<Principal,Follower>(p.followers);
                    supporterCount = Map.size<Principal,Supporter>(p.supporters);
                };
                return #ok(?pp);
            };
        };
        return #err("Profile not found.");
    };

    public query func getFollowerInfo(userPrincipal : Text, urlParam : Text) : async Result<?Follower, Text> {
        for (patron in Map.vals<Principal, Patron>(patrons)) {
            if (patron.urlParam == urlParam) {
                for (follower in Map.vals<Principal, Follower>(patron.followers)) {
                    if (Principal.equal(follower.principal, Principal.fromText(userPrincipal))) {
                        return #ok(?follower);
                    };
                };
                return #ok(null);
            }
        };
        return #err("Profile not found.")
    };

    public query func getSupporterInfo(userPrincipal : Text, urlParam : Text) : async Result<?Supporter, Text> {
        for (patron in Map.vals<Principal, Patron>(patrons)) {
            if (patron.urlParam == urlParam) {
                for (supporter in Map.vals<Principal, Supporter>(patron.supporters)) {
                    if (Principal.equal(supporter.principal, Principal.fromText(userPrincipal))) {
                        return #ok(?supporter);
                    };
                };
                return #ok(null);
            }
        };
        return #err("Profile not found.")
    };

    /////// UTILS ///////

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

    public query func getPatrons() : async [ProtectedPatron] {
        //let allPatrons = Map.toArrayMap<Principal, Patron, Patron>(patrons, func(k : Principal, v : Patron) : ?Patron { return ?v; });
        let allPatrons = Buffer.Buffer<ProtectedPatron>(0);
        for (p in Map.vals<Principal, Patron>(patrons)) {
            var pp : ProtectedPatron = {
                name = p.name;
                urlParam = p.urlParam;
                shortDescription = p.shortDescription;
                fullDescription = p.fullDescription;
                xAccount = p.xAccount;
                ytAccount = p.ytAccount;
                followerCount = p.followers.size();
                supporterCount = p.supporters.size();
            };
            allPatrons.add(pp);
        };
        return Buffer.toArray(allPatrons);
    };

    public query func getAllPatrons() : async [FullPatron] {
        let allPatrons = Buffer.Buffer<FullPatron>(0);
        for (p in Map.vals<Principal, Patron>(patrons)) {
            let followers = Buffer.Buffer<Follower>(0);
            for (f in Map.vals<Principal, Follower>(p.followers)) {
                followers.add(f);
            };
            let supporters = Buffer.Buffer<Supporter>(0);
            for (s in Map.vals<Principal, Supporter>(p.supporters)) {
                supporters.add(s);
            };
            var pp : FullPatron = {
                name = p.name;
                urlParam = p.urlParam;
                shortDescription = p.shortDescription;
                fullDescription = p.fullDescription;
                xAccount = p.xAccount;
                ytAccount = p.ytAccount;
                followers = Buffer.toArray(followers);
                supporters = Buffer.toArray(supporters);
            };
            allPatrons.add(pp);
        };
        return Buffer.toArray(allPatrons);
    };

    public func dropAllPatrons() : async () {
        for (principal in Map.keys<Principal, Patron>(patrons)) {
            Map.delete<Principal, Patron>(patrons, phash, principal);
        };
        return;
    };

    public query ({ caller }) func whoami() : async Text {
        return Principal.toText(caller);
    };
};
