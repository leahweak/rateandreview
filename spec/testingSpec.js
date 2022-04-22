

describe("searchForShow", () => {

    beforeEach(() => {
        showList = await fetchImages("girls");
    });

    it("first item is correct", () => {
        expect(showList.pop()).toBe(Promise);
    });
});