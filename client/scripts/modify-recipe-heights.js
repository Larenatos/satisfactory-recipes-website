const toggleMaxHeight = (element, parent = null) => {
  if (!element.style.maxHeight || element.style.maxHeight === "0px") {
    const elementScrollHeight = element.scrollHeight;
    element.style.maxHeight = elementScrollHeight + "px";

    if (parent) {
      const parentMaxHeight = parseInt(parent.style.maxHeight);
      const isParentAnimating = parentMaxHeight > parent.scrollHeight;
      const parentHeight = isParentAnimating
        ? parentMaxHeight
        : parent.scrollHeight;

      const updatedParentMaxHeight = elementScrollHeight + parentHeight;
      parent.style.maxHeight = updatedParentMaxHeight + "px";
    }
  } else {
    element.style.maxHeight = "0px";
  }
};

const toggleRecipeHeight = (recipeUl, recipesDiv, recipeNameSvg) => {
  toggleMaxHeight(recipeUl, recipesDiv);
  recipeNameSvg.classList.toggle("rotated");
};

export { toggleMaxHeight, toggleRecipeHeight };
