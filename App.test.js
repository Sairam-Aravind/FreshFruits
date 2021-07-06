const createtextelement=require('./App');
test('creating text element', () => {
    expect(createtextelement().id).toBe("text")
    expect(createtextelement().name).toBe("comments")
})

const setClassName=require('./App');
test('setting the class name', () => {
    let div = document.createElement("div")
    div.className = "something"
    expect(setClassName(div,"rating").className).toBe('tab-container')
})