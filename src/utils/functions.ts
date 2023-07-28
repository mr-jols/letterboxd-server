/* eslint-disable wrap-regex */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { format } from "date-fns";
import { ObjectType } from "./types";
import { Document, HydratedDocument } from "mongoose";
import {
  Countries,
  Genres,
  Languages,
  WatchProviders,
} from "../services/tmdb/constants";
import { Response } from "express";

export const isEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export function queryToString(query: ObjectType): string {
  return Object.entries(query)
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
}

export function isInEnum(value: any, myEnum: any): boolean {
  if (!value) return false;
  return Object.values(myEnum).includes(value);
}

export function isString(value: any): boolean {
  return typeof value === "string";
}

export function isPage(value: any): boolean {
  return Number(value) > 0;
}

export function formatDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function isValidGenreId(id: number): boolean {
  return Object.values(Genres).filter((item) => item.id === id).length > 0;
}

export function convertGenreIdToGenre(id: number): string {
  return Object.values(Genres).filter((item) => item.id === id)
  .map(item=>item.name)[0];
}

export function isValidCountryId(val: string): boolean {
  return (
    Object.values(Countries).filter(
      (item) => item.iso_3166_1.toLowerCase() === val.toLowerCase()
    ).length > 0
  );
}

export function isValidLanguageId(val: any): boolean {
  return Object.values(Languages).includes(val);
}

export function isValidWatchProviderId(id: number): boolean {
  return (
    Object.values(WatchProviders).filter((item) => item.provider_id === id)
      .length > 0
  );
}

export async function updateModel<
  T extends Document & HydratedDocument<R, M>,
  U,
  R extends U,
  M
>(doc: T, props: U): Promise<HydratedDocument<R, M>> {
  Object.assign(doc, props, { new: true });
  return doc.save();
}

export function SuccessHandler(res: Response, json: object): Response<object> {
  return res.status(200).send({ status: 200, ...json });
}
