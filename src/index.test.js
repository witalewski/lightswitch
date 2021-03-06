const index = require("./index");

describe("nightcall index", () => {
    test("exposes proper interface", () => {
        expect(typeof(index.performUpdate)).toEqual("function");
        expect(typeof(index.changeTheme)).toEqual("function");
        expect(typeof(index.removeAllAgentsAndFiles)).toEqual("function");
        expect(typeof(index.setLocation)).toEqual("function");
        expect(typeof(index.displayHelp)).toEqual("function");
        expect(typeof(index.createStartupAgent)).toEqual("function");
        expect(typeof(index.pauseUpdates)).toEqual("function");
        expect(typeof(index.resumeUpdates)).toEqual("function");
   });
 });
 