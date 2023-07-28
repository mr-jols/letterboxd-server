/* eslint-disable no-undef */
import {
  isValidCountryId,
  isValidGenreId,
  isValidLanguageId,
  isValidWatchProviderId,
} from "../../src/utils/functions";

describe("Function tests", () => {
  it("validates a genre by id", () => {
    expect(isValidGenreId(9648)).toBe(true);
    expect(isValidGenreId(964)).toBe(false);
  });
  it("validates country by id", () => {
    expect(isValidCountryId("ng")).toBe(true);
    expect(isValidCountryId("ngx")).toBe(false);
  });
  it("validates a language by id", () => {
    expect(isValidLanguageId("ig")).toBe(true);
    expect(isValidLanguageId("igx")).toBe(false);
  });
  it("validates a watch provider by id", () => {
    expect(isValidWatchProviderId(8)).toBe(true);
  });
});
