import { describe, expect, it } from "vitest";
import { formatResultCount, machineFamilyOf, packFromText, partKindOf } from "../shared/catalog-taxonomy";
import { catalogTestMock } from "../shared/catalog-test-mocks";

describe("catalog taxonomy", () => {
  it("classifies optics and nozzles from existing labels", () => {
    expect(partKindOf({ categorySlug: "optyka", name: "Soczewka Zn-Se" })).toBe("optyka");
    expect(partKindOf({ groupName: "Dysze standardowe K", name: "HK10" })).toBe("dysze");
  });

  it("only assigns machine family from explicit group names", () => {
    expect(machineFamilyOf({ groupName: "Turbo / Super Turbo – dysze standardowe", name: "Tip" })).toBe("turbo");
    expect(machineFamilyOf({ groupName: "Dysze standardowe K", name: "HK10" })).toBe(null);
  });

  it("reads pack size only from confirmed copy", () => {
    expect(packFromText("Wszystkie dysze konfekcjonowane w opakowaniach po 10 szt.")).toBe(10);
    expect(packFromText("Ceramic nozzle holder")).toBe(null);
  });

  it("mocks pack size and stock for tests when catalogue text is silent", () => {
    const ceramic = catalogTestMock({
      id: 1,
      name: "Stożek ceramiczny",
      groupName: "Części szybko zużywające się – głowica",
      categorySlug: "trumpf",
    });
    expect(ceramic.packSize).toBe(null);
    expect(ceramic.availability).toBe("in_stock");
    expect(ceramic.family).toBe("trulaser-test");

    const nozzle = catalogTestMock({
      id: 2,
      name: "Dysza fi 0,8 mm standard",
      groupName: "Dysze standardowe K",
      categorySlug: "trumpf",
    });
    expect(nozzle.packSize).toBe(10);
    expect(nozzle.salesUnit).toBe("opakowanie");

    const onOrder = catalogTestMock({
      id: 4,
      name: "Soczewka Zn-Se",
      categorySlug: "optyka",
    });
    expect(onOrder.availability).toBe("on_order");
  });

  it("declines Polish result counts", () => {
    expect(formatResultCount(1, "pl")).toBe("1 pozycja");
    expect(formatResultCount(2, "pl")).toBe("2 pozycje");
    expect(formatResultCount(5, "pl")).toBe("5 pozycji");
  });
});
