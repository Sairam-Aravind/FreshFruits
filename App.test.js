const createtextelement = require("./App");
test("creating text element", () => {
  expect(createtextelement().id).toBe("text");
  expect(createtextelement().name).toBe("comments");
});

const onclickBack = require("./App");
jest.spyOn(window.localStorage.__proto__, "setItem");
window.localStorage.__proto__.setItem = jest.fn();
window.localStorage.setItem("index", 2);
test("checking back for index value greater than zero", () => {
  onclickBack();
  expect(localStorage.setItem).toHaveBeenCalled();
});
test("clicking back on index value zero", () => {
  jest.spyOn(window.localStorage.__proto__, "removeItem");
  window.localStorage.__proto__.removeItem = jest.fn();
  window.localStorage.setItem("index", 1);
  onclickBack();
  expect(localStorage.removeItem).toHaveBeenCalled();
});

const onclickNext = require("./App");
jest.spyOn(window.localStorage.__proto__, "setItem");
window.localStorage.__proto__.setItem = jest.fn();
window.localStorage.setItem("index", 3);
test("clicking next when index is zero", () => {
  onclickNext();
  expect(localStorage.setItem).toHaveBeenCalled();
});
test("clicking next on index greater than 3", () => {
  jest.spyOn(window.localStorage.__proto__, "removeItem");
  window.localStorage.__proto__.removeItem = jest.fn();
  window.localStorage.setItem("index", 3);
  onclickNext();
  expect(localStorage.removeItem).toHaveBeenCalled();
});

const loadFirst = require("./App");
jest.spyOn(window.localStorage.__proto__, "setItem");
window.localStorage.__proto__.setItem = jest.fn();
window.localStorage.setItem("index", 3);
test("clicking proceed", () => {
  loadFirst();
  expect(localStorage.setItem).toHaveBeenCalled();
});
