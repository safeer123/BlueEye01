const btnToIconClass = {
  btn0: "fa fa-circle",
  btnLeft: "fa fa-chevron-circle-left",
  btnRight: "fa fa-chevron-circle-right",
  btnMinus: "fa fa-minus-circle",
  btnPlus: "fa fa-plus-circle",
  btnFullscreen: "fa fa-square",
  btnPicture: "fa fa-image"
};

const defaultIconClass = "far fa-dot-circle";

const getIconClass = btn =>
  btn in btnToIconClass ? btnToIconClass[btn] : defaultIconClass;

export { getIconClass };
