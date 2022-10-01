// @ts-ignore
import * as stuffs from "stuffs";
import { NamespaceData, NamespaceEnums } from "../../generated/namespaceData";
import { DBI } from "../DBI";

export interface DBILangObject {
  [property: string]: DBILangObject & ((...args: any[]) => string);
}

export interface DBILangConstructorObject {
  [property: string]: DBILangConstructorObject | string;
}

export type TDBILocaleString = "en" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "fi" | "fr" | "de" | "el" | "hi" | "hu" | "it" | "ja" | "ko" | "no" | "pl" | "pt" | "ro" | "ru" | "es" | "sv" | "th" | "tr" | "uk" | "vi";

export type TDBILocaleConstructor<TNamespace extends NamespaceEnums> = Omit<DBILocale<TNamespace>, "data" | "dbi"> & { data: DBILangConstructorObject };

export class DBILocale<TNamespace extends NamespaceEnums> {
  name: TDBILocaleString;
  data: NamespaceData[TNamespace]["contentLocale"];
  private _data;
  dbi: DBI<TNamespace, {}>;
  constructor(dbi: DBI<TNamespace, {}>, cfg: TDBILocaleConstructor<TNamespace>) {
    this.dbi = dbi;
    this.name = cfg.name;
    this._data = cfg.data;
    this.data = convertLang<TNamespace>(cfg.data as any);
  }
}

export function convertLang<TNamespace extends NamespaceEnums>(data: DBILangConstructorObject): NamespaceData[TNamespace]["contentLocale"] {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => {
    if (typeof value === "string") {
      return [key, (...args: any[]) => {
        return stuffs.mapReplace(value, Object.fromEntries(args.map((t, i) => [`{${i}}`, t])))
      }]
    } else {
      return [key, convertLang(value)];
    }
  }))
}
