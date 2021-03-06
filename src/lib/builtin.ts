/**
 * @tuzhanai/value-type-manager
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 * @author Yourtion Guo <yourtion@gmail.com>
 */

import * as assert from "assert";
import validator from "validator";
import { ValueTypeManager } from "./index";

/** 格式化 Boolean 类型 */
function parseQueryBoolean(query: any, b: boolean) {
  const str = String(query);
  if (str === "1" || str === "true") {
    return true;
  } else if (str === "0" || str === "false") {
    return false;
  }
  return b;
}

// 注册内置类型 到类型管理器上
export default function registerBuiltinTypes(type: ValueTypeManager) {
  type.register("Boolean", {
    checker: (v: any) => typeof v === "boolean" || (typeof v === "string" && validator.isBoolean(v)),
    formatter: (v: any) => (typeof v === "boolean" ? v : parseQueryBoolean(v, !!v)),
    description: "布尔值",
    tsType: "boolean",
    swaggerType: "boolean",
    isBuiltin: true,
    isDefaultFormat: true,
  });

  type.register("Date", {
    checker: (v: any) => v instanceof Date || (typeof v === "string" && (v as string).split("-").length === 3),
    formatter: (v: any) => (v instanceof Date ? v : new Date(v)),
    description: "日期(2017-05-01)",
    tsType: "Date",
    swaggerType: "string",
    isBuiltin: true,
    isDefaultFormat: true,
  });

  type.register("String", {
    checker: (v: any) => typeof v === "string",
    description: "字符串",
    tsType: "string",
    swaggerType: "string",
    isBuiltin: true,
  });

  type.register("TrimString", {
    checker: (v: any) => typeof v === "string",
    formatter: (v: string) => v.trim(),
    description: "自动去首尾空格的字符串",
    tsType: "string",
    swaggerType: "string",
    isBuiltin: true,
    isDefaultFormat: true,
  });

  type.register("NotEmptyString", {
    checker: (v: any) => typeof v === "string" && !validator.isEmpty(v),
    formatter: (v: string) => v.trim(),
    description: "不能为空字符串的字符串",
    tsType: "string",
    swaggerType: "string",
    isBuiltin: true,
    isDefaultFormat: true,
  });

  type.register("Number", {
    parser: (v: any) => Number(v),
    checker: (v: any, p: any) => {
      const ok = !isNaN(v);
      if (ok && p) {
        if ("min" in p && !(v >= p.min)) {
          return false;
        }
        if ("max" in p && !(v <= p.max)) {
          return false;
        }
      }
      return ok;
    },
    paramsChecker: (params: any) => {
      if ("max" in params) {
        assert.ok(
          typeof params.max === "number",
          `params.max必须为数值类型，但实际输入为${params.max}(${typeof params.max})`,
        );
      }
      if ("min" in params) {
        assert.ok(
          typeof params.min === "number",
          `params.min必须为数值类型，但实际输入为${params.min}(${typeof params.min})`,
        );
      }
      if ("max" in params && "min" in params) {
        assert.ok(params.min < params.max, `params.min必须小于params.max`);
      }
      return true;
    },
    description: "数值",
    tsType: "number",
    swaggerType: "number",
    isBuiltin: true,
  });

  type.register("Integer", {
    checker: (v: any) => validator.isInt(String(v)),
    formatter: (v: any) => Number(v),
    description: "整数",
    tsType: "number",
    swaggerType: "integer",
    isBuiltin: true,
    isDefaultFormat: true,
  });

  type.register("Float", {
    checker: (v: any) => validator.isFloat(String(v)),
    formatter: (v: any) => Number(v),
    description: "浮点数",
    tsType: "number",
    swaggerType: "number",
    isBuiltin: true,
    isDefaultFormat: true,
  });

  type.register("Object", {
    checker: (v: any) => v && typeof v === "object",
    description: "对象",
    tsType: "Record<string, any>",
    swaggerType: "object",
    isBuiltin: true,
  });

  type.register("Array", {
    checker: (v: any) => Array.isArray(v),
    paramsChecker: (params: any) => {
      return typeof params === "string" || (typeof params === "object" && typeof params.type === "string");
    },
    description: "数组",
    tsType: "any[]",
    swaggerType: "array",
    isBuiltin: true,
  });

  type.register("JSON", {
    checker: (v: any) => typeof v === "string" && validator.isJSON(v),
    formatter: (v: string) => JSON.parse(v),
    description: "来源于JSON字符串的对象",
    tsType: "Record<string, any>",
    swaggerType: "object",
    isBuiltin: true,
    isDefaultFormat: true,
  });

  type.register("JSONString", {
    checker: (v: any) => typeof v === "string" && validator.isJSON(v),
    formatter: (v: string) => v.trim(),
    description: "JSON字符串",
    tsType: "string",
    swaggerType: "string",
    isBuiltin: true,
    isDefaultFormat: true,
  });

  type.register("Any", {
    checker: (_: any) => true,
    description: "任意类型",
    tsType: "any",
    swaggerType: "string",
    isBuiltin: true,
  });

  type.register("MongoIdString", {
    checker: (v: any) => validator.isMongoId(String(v)),
    description: "MongoDB ObjectId 字符串",
    tsType: "string",
    swaggerType: "string",
    isBuiltin: true,
  });

  type.register("Email", {
    checker: (v: any) => typeof v === "string" && validator.isEmail(v),
    description: "邮箱地址",
    tsType: "string",
    swaggerType: "string",
    isBuiltin: true,
  });

  type.register("Domain", {
    checker: (v: any) => typeof v === "string" && validator.isFQDN(v),
    description: "域名（比如：domain.com）",
    tsType: "string",
    swaggerType: "string",
    isBuiltin: true,
  });

  type.register("Alpha", {
    checker: (v: any) => typeof v === "string" && validator.isAlpha(v),
    description: "字母字符串（a-zA-Z）",
    tsType: "string",
    swaggerType: "string",
    isBuiltin: true,
  });

  type.register("AlphaNumeric", {
    checker: (v: any) => typeof v === "string" && validator.isAlphanumeric(v),
    description: "字母和数字字符串（a-zA-Z0-9）",
    tsType: "string | number",
    swaggerType: "string",
    isBuiltin: true,
  });

  type.register("Ascii", {
    checker: (v: any) => typeof v === "string" && validator.isAscii(v),
    description: "ASCII字符串",
    tsType: "string",
    swaggerType: "string",
    isBuiltin: true,
  });

  type.register("Base64", {
    checker: (v: any) => typeof v === "string" && validator.isBase64(v),
    description: "base64字符串",
    tsType: "string",
    swaggerType: "string",
    isBuiltin: true,
  });

  type.register("URL", {
    checker: (v: any) => typeof v === "string" && validator.isURL(v),
    description: "URL字符串",
    tsType: "string",
    swaggerType: "string",
    isBuiltin: true,
  });

  type.register("ENUM", {
    checker: (v: any, p: any) => p && v && p.indexOf(v) > -1,
    paramsChecker: (params: any) => {
      assert.ok(params && Array.isArray(params) && params.length > 0, `params 必须为类型数组，且长度大于 0`);
      return true;
    },
    description: "枚举类型",
    tsType: "any",
    swaggerType: "string",
    isBuiltin: true,
    isParamsRequired: true,
  });

  type.register("IntArray", {
    parser: (v: any) => {
      if (Array.isArray(v)) return v;
      return String(v)
        .split(",")
        .map((n) => Number(n))
        .sort();
    },
    checker: (v: any[]) => {
      let ok = Array.isArray(v);
      v.forEach((n) => {
        ok = ok && validator.isInt(String(n));
      });
      return ok;
    },
    description: "逗号分隔的Int数组",
    tsType: "number[]",
    swaggerType: "array",
    isBuiltin: true,
  });

  type.register("StringArray", {
    parser: (v: any) => (Array.isArray(v) ? v : String(v).split(",")),
    checker: (v: any[]) => {
      return Array.isArray(v);
    },
    formatter: (arr: string[]) => arr.map((v) => String(v).trim()),
    isDefaultFormat: true,
    description: "逗号分隔的字符串数组",
    tsType: "string[]",
    swaggerType: "array",
    isBuiltin: true,
  });
}
