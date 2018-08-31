/**
 * @tuzhanai/value-type-manager
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

import * as assert from "assert";

export interface IValueTypeOptions {
  checker?: (v: any) => boolean;
  formatter?: (v: any) => any;
  comment?: string;
}

export class ValueTypeItem {
  constructor(protected readonly options: IValueTypeOptions) {}
  public check(value: any): boolean {}
  public format(value: any): any {}
}

export class ValueTypeManager {
  protected readonly map: Map<string, ValueTypeItem> = new Map();

  public register(type: string, options: IValueTypeOptions): this {
    this.map.set(type, new ValueTypeItem(options));
    return this;
  }

  public get(type: string): ValueTypeItem {
    const t = this.map.get(type);
    assert.ok(t);
    return t!;
  }

  public check(type: string, value: any): boolean {
    return this.get(type).check(value);
  }

  public format(type: string, value: any): any {
    return this.get(type).format(value);
  }
}

export default ValueTypeManager;
