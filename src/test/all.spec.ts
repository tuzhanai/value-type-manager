import { ValueTypeManager } from "../lib";
import { expect } from "chai";

const date = new Date();

const A = [
  // Boolean
  ["Boolean", true, { type: "Boolean" }, true],
  ["Boolean", false, { type: "Boolean" }, false],
  ["Boolean", "false", { type: "Boolean" }, false],
  ["Boolean", "true", { type: "Boolean", format: false }, "true"],

  // Date
  ["Date", date, { type: "Date" }, date],

  // String
  ["String", "1", { type: "String" }, "1"],
  ["TrimString", " 1 ", { type: "TrimString", format: false }, " 1 "],
  ["TrimString", " 1 ", { type: "TrimString" }, "1"],
  ["NotEmptyString", "1", { type: "NotEmptyString" }, "1"],

  // Number
  ["Number", "1", { type: "Number" }, 1],
  ["Integer", "-1", { type: "Integer" }, -1],
  ["Integer", "1", { type: "Integer", format: false }, "1"],
  ["Integer", 1, { type: "Integer" }, 1],
  ["Float", "1.1", { type: "Float" }, 1.1],
  ["Float", "-1", { type: "Float", format: true }, -1],
  ["Float", "100.12233", { type: "Float", format: false }, "100.12233"],

  // Object
  ["Object", { a: 1 }, { type: "Object" }, { a: 1 }],
  ["Object", {}, { type: "Object" }, {}],
  ["Object", ["1"], { type: "Object" }, ["1"]],

  // JSON
  ["JSON", `{"a": "b"}`, { type: "JSON", format: false }, `{"a": "b"}`],
  ["JSON", `{"a": "b"}`, { type: "JSON" }, { a: "b" }],
  ["JSONString", `{"a": "b"}`, { type: "JSONString", format: false }, `{"a": "b"}`],
  ["JSONString", ` {"a": "b"} `, { type: "JSONString" }, `{"a": "b"}`],

  // Array
  ["Array", ["1"], { type: "Array" }, ["1"]],
  ["Array", [1, 2, 3], { type: "Array" }, [1, 2, 3]],
  ["IntArray", [1, 2, 3], { type: "IntArray" }, [1, 2, 3]],
  ["IntArray", "1, 5, 3", { type: "IntArray" }, [1, 3, 5]],
  ["StringArray", ["a", 2, "3"], { type: "StringArray" }, ["a", "2", "3"]],
  ["StringArray", "a, 5, q", { type: "StringArray" }, ["a", "5", "q"]],

  // Nullable
  ["NullableString", "1", { type: "NullableString" }, "1"],
  ["NullableString", null, { type: "NullableString" }, null],
  ["NullableInteger", "1", { type: "NullableInteger" }, 1],
  ["NullableInteger", "1", { type: "NullableInteger", format: true }, 1],
  ["NullableInteger", 1, { type: "NullableInteger" }, 1],
  ["NullableInteger", null, { type: "NullableInteger" }, null],

  // Other
  ["Any", "1", { type: "Any" }, "1"],
  ["Any", 1, { type: "Any" }, 1],
  ["Any", null, { type: "Any" }, null],
  ["Any", { a: "b" }, { type: "Any" }, { a: "b" }],
  ["MongoIdString", "507f1f77bcf86cd799439011", { type: "MongoIdString" }, "507f1f77bcf86cd799439011"],
  ["Email", "yourtion@gmail.com", { type: "Email" }, "yourtion@gmail.com"],
  ["Domain", "yourtion.com", { type: "Domain" }, "yourtion.com"],
  ["Alpha", "Yourtion", { type: "Alpha" }, "Yourtion"],
  ["AlphaNumeric", "Yourtion012", { type: "AlphaNumeric" }, "Yourtion012"],
  ["Ascii", "Yourtion.com/hello", { type: "Ascii" }, "Yourtion.com/hello"],
  ["Base64", "WW91cnRpb24=", { type: "Base64" }, "WW91cnRpb24="],
  ["URL", "http://github.com/yourtion", { type: "URL" }, "http://github.com/yourtion"],
  ["ENUM", "Hello", { type: "ENUM", params: ["Hello", "World"] }, "Hello"],
];

const B = [
  ["Number", -2, { type: "Number", params: { min: 0 } }],
  ["Number", 200, { type: "Number", params: { max: 10 } }],
  ["Number", "-1", { type: "Number", params: { min: 0, max: 10 } }],
  ["Integer", "-1.0", { type: "Integer" }],
  ["Integer", "Yourtion", { type: "ENUM", params: ["Hello", "World"] }],
  ["ENUM", "Yourtion", { type: "ENUM", params: ["Hello", "World"] }],
  ["NotEmptyString", "", { type: "NotEmptyString" }],
];

describe("test ValueTypeManager", function () {
  const manager = new ValueTypeManager();

  function getValue(type: string, input: any, { params, format }: any) {
    return manager.value(type, input, params, format);
  }

  describe("Success", function () {
    A.forEach((item: any) => {
      it(`Builtin - ${item[0]} (${item[1]}) success`, function () {
        const type = item[0];
        const input = item[1];
        const params = item[2];
        const expected = item[3];
        const { ok, message, value } = getValue(type, input, params);
        // console.log(...item);
        // console.log("----", ok, message, value);
        expect(ok).to.equal(true);
        expect(message).to.equal("success");
        expect(value).to.deep.equal(expected);
      });
    });
  });

  describe("Nullable", function () {
    const testSet = new Set(A.map((i) => i[0]).filter((i: any) => i.indexOf("Nullable") === -1));
    testSet.forEach((type: any) => {
      it(`Nullable - Nullable${type} success`, function () {
        const { ok, message, value } = getValue(`Nullable${type}`, null, {});
        expect(ok).to.equal(true);
        expect(message).to.equal("success");
        expect(value).to.null;
      });
    });
  });

  describe("Fixed", function () {
    it("Builtin - DateISOString Date success", function () {
      const d = new Date();
      const { ok, message, value } = getValue("Date", d.toJSON(), { type: "Date" });
      expect(ok).to.equal(true);
      expect(message).to.equal("success");
      expect(value.toJSON()).to.equal(d.toJSON());
    });
  });

  describe("Failure", function () {
    B.forEach((item: any) => {
      it(`Builtin - ${item[0]} (${item[1]}) failure`, function () {
        const type = item[0];
        const input = item[1];
        const params = item[2];
        const { ok } = getValue(type, input, params);
        // console.log(...item);
        // console.log("----", ok, message, value);
        expect(ok).to.equal(false);
      });
    });
  });

  describe("Error Code", function () {
    const type = new ValueTypeManager();

    it("parse failure", function () {
      type.register("ParseFailure", {
        parser: () => {
          throw new Error("haha");
        },
      });
      const { ok, message, code } = type.value("ParseFailure", 123);
      expect(ok).to.equal(false);
      expect(message).to.equal("haha");
      expect(code).to.equal("PARSE_FAILURE");
    });

    it("check failure", function () {
      type.register("CheckFailure", {
        checker: () => {
          throw new Error("haha");
        },
      });
      const { ok, message, code } = type.value("CheckFailure", 123);
      expect(ok).to.equal(false);
      expect(message).to.equal("haha");
      expect(code).to.equal("CHECK_FAILURE");
    });

    it("format failure", function () {
      type.register("FormatFailure", {
        formatter: () => {
          throw new Error("haha");
        },
        isDefaultFormat: true,
      });
      const { ok, message, code } = type.value("FormatFailure", 123);
      expect(ok).to.equal(false);
      expect(message).to.equal("haha");
      expect(code).to.equal("FORMAT_FAILURE");
    });
  });
});
