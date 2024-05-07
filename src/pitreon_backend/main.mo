import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Types "types";
actor {
  type Patron = Types.Patron;
  type Result<Ok, Err> = Types.Result<Ok, Err>;
  let patrons = HashMap.HashMap<Principal,Patron>(0, Principal.equal, Principal.hash);

  public shared ({ caller }) func addPatron(patron : Patron) : async Result<(), Text> {
    switch (patrons.get(caller)) {
      case (null) {
          patrons.put(caller, patron);
          return #ok();
      };
      case (?patron) {
          return #err("This patron already exists.");
      };
    };
  };

  public query func getAllPatrons() : async [Patron] {
    return Iter.toArray(patrons.vals());
  };

  public query ({ caller }) func greet() : async Text {
    return "Helloi, " # Principal.toText(caller) # "!";
  };
};
