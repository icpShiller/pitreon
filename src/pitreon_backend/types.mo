import Result "mo:base/Result";
module {
    public type Result<Ok, Err> = Result.Result<Ok, Err>;
    public type Patron = {
        name : Text;
    };
};