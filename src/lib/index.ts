/**
 * @tuzhanai/value-type-manager
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import * as assert from "assert";
import registerBuiltinTypes from "./builtin";

export interface IValueTypeOptions {
  /** 检查方法 */
  checker?: ((v: any, p?: any) => boolean) | RegExp;
  /** 类型动态参数检查器 */
  paramsChecker?: (p: any) => boolean;
  /** 类型动态参数是否必须 */
  isParamsRequired?: boolean;
  /** 解析方法 */
  parser?: (v: any) => any;
  /** 格式化方法 */
  formatter?: (v: any) => any;
  /** 说明信息 */
  description?: string;
  /** 是否默认自动格式化 */
  isDefaultFormat?: boolean;
  /** 对应的TypeScript类型 */
  tsType?: string;
  /** 是否为系统内置的类型 */
  isBuiltin?: boolean;
}

export interface ICheckResult {
  /** 是否成功 */
  ok: boolean;
  /** 如果失败，则表示出错信息 */
  message: string;
}

export interface IValueResult extends ICheckResult {
  /** 值 */
  value: any;
}

export class ValueTypeItem {
  constructor(protected readonly options: IValueTypeOptions) {}

  /**
   * 类型信息
   */
  public get info(): IValueTypeOptions {
    return this.options;
  }

  /**
   * 检查参数是否合法
   * @param input 输入值
   * @param params 类型选项
   */
  public check(input: any, params: any): ICheckResult {
    if (!this.options.checker) return { ok: true, message: "success" };
    const checker = this.options.checker;
    try {
      const ok = checker instanceof RegExp ? checker.test(input) : checker(input, params);
      return { ok, message: ok ? "success" : "failure" };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  }

  /**
   * 解析参数
   * @param input 输入值
   */
  public parse(input: any): any {
    if (!this.options.parser) return input;
    return this.options.parser(input);
  }

  /**
   * 格式化参数
   * @param input 输入值
   */
  public format(input: any): any {
    if (!this.options.formatter) return input;
    return this.options.formatter(input);
  }

  /**
   * 检查参数，如果参数默认开启格式化，则格式化
   * @param input
   * @param params 类型选项
   */
  public value(input: any, params: any): IValueResult {
    try {
      input = this.parse(input);
      const { ok, message } = this.check(input, params);
      if (!ok) return { ok, message, value: input };
      const value = this.format(input);
      return { ok, message, value };
    } catch (err) {
      return { ok: false, message: err.message, value: input };
    }
  }
}

export interface ValueTypeManagerOptions {
  /** 是否关闭内置类型 */
  disableBuiltinTypes?: boolean;
}

export class ValueTypeManager {
  protected readonly map: Map<string, ValueTypeItem> = new Map();

  constructor(protected readonly options: ValueTypeManagerOptions = {}) {
    if (!options.disableBuiltinTypes) {
      registerBuiltinTypes(this);
    }
  }

  public register(type: string, options: IValueTypeOptions): this {
    this.map.set(type, new ValueTypeItem(options));
    return this;
  }

  public get(type: string): ValueTypeItem {
    const t = this.map.get(type);
    assert.ok(t);
    return t!;
  }

  public value(type: string, input: any, params: any): IValueResult {
    return this.get(type).value(input, params);
  }
}

export default ValueTypeManager;
