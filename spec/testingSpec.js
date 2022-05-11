
/* Testing functions in signUp.js */
describe("validate inputs", () => {
    it("check length", () => {
        expect(checkLength("hello", 3)).toBe(true);
        expect(checkLength("", 2)).toBe(false);
        expect(checkLength(245, 2)).toBe(false);
        expect(checkLength(null,5)).toBe(false);
    });

    it("checks uppercase/number", () => {
        expect(checkPassword("Leah45")).toBe(true);
        expect(checkPassword(null)).toBe(false);
        expect(checkPassword()).toBe(false);
        expect(checkPassword("emily5")).toBe(false);
        expect(checkPassword("Emily")).toBe(false);
    })
});

/* Testing tv show search function in search.js and list.js*/
describe("check search output", () => {


    it("has correct return value", async () => {
        let map = await fetchImages("");
        expect(map.size).toBe(0);
        map = await fetchImages("ashlee");
        expect(map.get(35131)).toBe("https://static.tvmaze.com/uploads/images/medium_portrait/147/368126.jpg");
        map = await fetchImages("girl");
        expect(map.size>0).toBe(true);
    });
});