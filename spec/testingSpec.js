

describe("searchForShow", () => {

    beforeEach(() => {
        fetchImages("girls")
    });

    it("first item is correct", () => {
        expect(url).toBe("https://api.tvmaze.com/search/shows?q=girls");
    });
});